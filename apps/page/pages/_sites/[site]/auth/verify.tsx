import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { httpPost } from "../../../../utils/http";

export default function VerifyMagicLink() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState<
    "loading" | "verifying" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!token || typeof token !== "string") {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    setStatus("verifying");
    verifyToken(token);
  }, [router.isReady, token]);

  const verifyToken = async (verificationToken: string) => {
    try {
      const response = await httpPost({
        url: "/api/auth/verify-magic-link",
        data: {
          token: verificationToken,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage("Email verified successfully! You are now signed in.");

        // Redirect to the previous page or homepage after 2 seconds
        setTimeout(() => {
          const redirectTo = sessionStorage.getItem("auth_redirect") || "/";
          sessionStorage.removeItem("auth_redirect");
          window.location.href = redirectTo;
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to verify email");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <NextSeo
        title="Verify Email - changes.page"
        description="Verify your email to complete sign-in"
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {status === "loading" && "Loading..."}
              {status === "verifying" && "Verifying your email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </h1>

            {(status === "loading" || status === "verifying") && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {status === "success" && (
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            {status === "error" && (
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>

            {status === "success" && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting you back to the page...
              </p>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <button
                  onClick={() => router.back()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go Back
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You can request a new magic link from the page you were
                  visiting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
