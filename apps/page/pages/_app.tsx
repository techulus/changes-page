import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { VisitorAuthProvider } from "../hooks/useVisitorAuth";
import "../styles/globals.css";

const ProgressBar = dynamic(
  () => import("../components/core/progress-bar.component"),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        ></meta>
      </Head>
      <ThemeProvider attribute="class">
        <VisitorAuthProvider>
          <Component {...pageProps} />
          <ProgressBar />
        </VisitorAuthProvider>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
