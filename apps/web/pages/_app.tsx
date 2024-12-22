import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import "../styles/global.css";
import { UserContextProvider } from "../utils/useUser";

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

  const router = useRouter();
  const googleTagId = "AW-11500375049";

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // @ts-ignore
      window.gtag("config", googleTagId, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, googleTagId]);

  return (
    <>
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
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
      />
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleTagId}', {
              send_page_view: false
            });
          `,
        }}
      />
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <UserContextProvider>
          {getLayout(<Component {...pageProps} />)}
          <Analytics />
        </UserContextProvider>
      </SessionContextProvider>
    </>
  );
}
