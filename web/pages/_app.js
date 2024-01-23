import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import Head from "next/head";
import { useState } from "react";
import "../styles/global.scss";
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
