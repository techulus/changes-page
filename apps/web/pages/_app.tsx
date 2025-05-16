import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import Head from "next/head";
import { Router } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, useState } from "react";
import "../styles/global.css";
import { UserContextProvider } from "../utils/useUser";

const ProgressBar = dynamic(
  () => import("../components/core/progress-bar.component"),
  {
    ssr: false,
  }
);

const geist = localFont({
  src: [
    { path: "../public/fonts/Geist/Geist-Regular.otf", weight: "500" },
    { path: "../public/fonts/Geist/Geist-Medium.otf", weight: "600" },
    { path: "../public/fonts/Geist/Geist-SemiBold.otf", weight: "700" },
    { path: "../public/fonts/Geist/Geist-Bold.otf", weight: "800" },
    { path: "../public/fonts/Geist/Geist-Black.otf", weight: "900" },
  ],
  display: "swap",
  variable: "--font-geist-sans",
  fallback: ["inter"],
});

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
      debug: process.env.NODE_ENV === "development",
    });

    const handleRouteChange = () => posthog.capture("$pageview");
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        ></meta>
      </Head>
      <style jsx global>{`
        :root {
          --geist-font: ${geist.style.fontFamily};
        }
      `}</style>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <UserContextProvider>
          {getLayout(<Component {...pageProps} />)}
          <ProgressBar />
        </UserContextProvider>
      </SessionContextProvider>
    </PostHogProvider>
  );
}
