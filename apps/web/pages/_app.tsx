import { Analytics } from "@vercel/analytics/next";
import dynamic from "next/dynamic";
import Head from "next/head";
import "../styles/global.css";
import { UserContextProvider } from "../utils/useUser";

const ProgressBar = dynamic(
  () => import("../components/core/progress-bar.component"),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        ></meta>
      </Head>
      <UserContextProvider initialSession={pageProps.initialSession}>
        {getLayout(<Component {...pageProps} />)}
        <ProgressBar />
      </UserContextProvider>
      <Analytics />
    </>
  );
}
