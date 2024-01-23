import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { DEFAULT_TITLE, SUBTITLE, TAGLINE } from "../data/marketing.data";
import { ROUTES } from "../data/routes.data";
import logoImage from "../public/images/logo.png";
import { getAppBaseURL } from "../utils/helpers";
import usePrefersColorScheme from "../utils/hooks/usePrefersColorScheme";
import { useUserData } from "../utils/useUser";

export default function Login() {
  const router = useRouter();
  const { redirectedFrom } = router.query;

  const { supabase } = useUserData();
  const prefersColorScheme = usePrefersColorScheme();

  const fontFamily =
    "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";

  return (
    <>
      <Head>
        <link rel="shortcut icon" href={logoImage.src} />
      </Head>

      <NextSeo
        title={DEFAULT_TITLE}
        description={SUBTITLE}
        openGraph={{
          title: DEFAULT_TITLE,
          description: SUBTITLE,
          type: "website",
          images: [
            {
              url: `https://changes.page/api/blog/og?tag=${encodeURIComponent(
                "changes.page"
              )}&title=${TAGLINE}`,
              width: 1200,
              height: 630,
              alt: SUBTITLE,
              type: "image/png",
            },
          ],
          siteName: "changes.page",
        }}
        twitter={{
          handle: "@arjunz",
          site: "@techulus",
          cardType: "summary_large_image",
        }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="max-w-md w-full space-y-4">
          <div className="flex flex-col items-center justify-center mb-8">
            <Link href={ROUTES.HOME} className={"w-10 h-10"}>
              <Image
                className={"w-10 h-10"}
                src={logoImage}
                alt="changes.page"
                width={40}
                height={40}
              />
            </Link>

            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Get Started
            </h2>

            <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              By using changes.page you agree to our{" "}
              <Link href={"/terms"} className="underline">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link href={"/privacy"} className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#4f46e5",
                    brandAccent: "#4338ca",
                  },
                  fonts: {
                    bodyFontFamily: fontFamily,
                    inputFontFamily: fontFamily,
                    buttonFontFamily: fontFamily,
                    labelFontFamily: fontFamily,
                  },
                  fontSizes: {
                    baseButtonSize: "1rem",
                    baseBodySize: "1rem",
                  },
                },
              },
              className: {
                message:
                  "inline-flex items-center rounded-md border border-gray-400 dark:border-gray-700 bg-gray-200 dark:bg-gray-900 px-2.5 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400",
              },
            }}
            providers={["github", "google"]}
            redirectTo={
              getAppBaseURL() +
              ROUTES.LOGIN_CALLBACK +
              (redirectedFrom ? `?redirectedFrom=${redirectedFrom}` : "")
            }
            theme={prefersColorScheme === "dark" ? "dark" : "light"}
            view="magic_link"
            showLinks={false}
          />
        </div>
      </div>
    </>
  );
}
