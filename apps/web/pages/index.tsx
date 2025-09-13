import { ServerIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/solid";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import Features from "../components/marketing/features";
import GetStartedHero from "../components/marketing/get-started-hero";
import Hero from "../components/marketing/hero";
import PricingSection from "../components/marketing/pricing-section";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const FAQs = dynamic(() => import("../components/marketing/faq"));

export default function Index({ addons, unit_amount, stars }) {
  return (
    <div className="h-full dark:bg-gray-800">
      <Head>
        <title>
          Changes.page - Changelog & Roadmap Platform for Product Teams
        </title>
        <meta
          name="description"
          content="Create beautiful release notes and interactive roadmaps. Notify users about updates, gather feedback with voting, and track engagement with built-in analytics. Start your free trial today."
        />
        {/* FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Do you offer free trial?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we offer a 14 days free trial.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need to enter a credit card to create a page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, you don't need to enter a credit card to create a page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I customize my page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can use your custom domain and branding to customize your page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you support custom domains?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we also provision SSL certificates for your custom domain.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is changes.page SEO friendly?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, our pages are server side rendered, making them fast and search engine friendly.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can users receive notifications about updates?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, users can receive instant email and RSS notifications about updates.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is changes.page reliable?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we have an industry-leading 99.9%+ uptime and our systems are highly scalable and redundant.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I automate my changelog page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can automate your page with the help of Zapier integration.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I see audience analytics for my page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can see detailed insights into your page's visitors with metrics such as top referrers, operating systems, and browser information.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you support markdown?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we use a markdown editor for writing posts in your page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you support roadmaps?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can create interactive roadmap boards with voting functionality to engage your community and prioritize features together.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <HeaderComponent />

      <main>
        <section>
          <Hero stars={stars} />
        </section>
        <Features />

        {/* HOW IT WORKS SECTION - Modern horizontal stepper */}
        <section className="bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center">
              How it works
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center flex-1 min-w-[180px] group transition-transform hover:scale-105">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg border-4 border-white dark:border-gray-900 transition-transform group-hover:scale-110">
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 font-bold shadow-md">
                    1
                  </span>
                  {/* UserPlus Icon from Lucide */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                    />
                    <circle cx="8.5" cy="7" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 8v6M23 11h-6"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Sign Up
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300 text-base text-center">
                  Create your account in seconds and get started instantly.
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:flex flex-1 h-1 relative items-center justify-center">
                <div
                  className="w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full opacity-70 animate-pulse"
                  style={{ zIndex: 0 }}
                />
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center flex-1 min-w-[180px] group transition-transform hover:scale-105">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 shadow-lg border-4 border-white dark:border-gray-900 transition-transform group-hover:scale-110">
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-2 py-0.5 font-bold shadow-md">
                    2
                  </span>
                  {/* Settings Icon from Lucide */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008.91 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09c.2.63.77 1.09 1.51 1.09H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Customize
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300 text-base text-center">
                  Add your branding, create roadmap boards, and connect integrations.
                </p>
              </div>
              {/* Connector */}
              <div className="hidden md:flex flex-1 h-1 relative items-center justify-center">
                <div
                  className="w-full h-1 bg-gradient-to-r from-pink-400 via-yellow-400 to-green-400 rounded-full opacity-70 animate-pulse"
                  style={{ zIndex: 0 }}
                />
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center flex-1 min-w-[180px] group transition-transform hover:scale-105">
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 shadow-lg border-4 border-white dark:border-gray-900 transition-transform group-hover:scale-110">
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-2 py-0.5 font-bold shadow-md">
                    3
                  </span>
                  {/* Send Icon from Lucide */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 2L11 13"
                    />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Publish & Notify
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300 text-base text-center">
                  Share updates and roadmap progress, notify users via email or RSS, and track
                  engagement with analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />
        {/* USE CASES SECTION - Asymmetric grid, unique accent colors */}
        <section className="bg-white dark:bg-gray-900 py-20 border-b border-gray-100 dark:border-gray-800">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center">
              Who uses this tool?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Card 1 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-8 flex flex-col items-start border-l-4 border-indigo-500">
                <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-indigo-100 dark:bg-gray-900 text-indigo-500 dark:text-indigo-400">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-500 mb-2">
                  SaaS Teams
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-base">
                  Keep your users informed about new features, bug fixes, and
                  product updates.
                </p>
              </div>
              {/* Card 2 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-8 flex flex-col items-start border-l-4 border-pink-500">
                <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-pink-100 dark:bg-gray-900 text-pink-500 dark:text-pink-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-pink-500 mb-2">
                  Product Managers
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-base">
                  Announce releases, share roadmaps with voting, gather feedback, and drive adoption with
                  every update.
                </p>
              </div>
            </div>
            {/* Wide card below */}
            <div className="grid grid-cols-1">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-8 flex flex-col items-start border-l-4 border-yellow-500">
                <div className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-yellow-100 dark:bg-gray-900 text-yellow-500 dark:text-yellow-400">
                  <ServerIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                  Developers
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-base">
                  Automate release notes and integrate with your CI/CD
                  pipeline.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />
        {/* INTEGRATIONS SECTION - Pills, logos, short desc, tinted bg */}
        <section className="bg-gray-100 dark:bg-gray-900 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center">
              Integrations
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Zapier pill */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-sm px-6 py-4 min-w-[260px] border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-gray-900 text-yellow-500 dark:text-yellow-400 mr-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    Zapier
                  </div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">
                    Automate your workflow with 5,000+ apps via
                    Zapier.
                  </div>
                </div>
                <Link
                  href="/integrations/zapier"
                  className="ml-4 text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                  Learn more
                </Link>
              </div>
              {/* GitHub pill */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-sm px-6 py-4 min-w-[260px] border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-400 mr-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v-5h2l-3-3-3 3h2v5h2z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    GitHub
                  </div>
                  <div className="text-gray-500 dark:text-gray-300 text-sm">
                    Connect your GitHub repo to automate release note
                    publishing.
                  </div>
                </div>
                <Link
                  href="https://github.com/marketplace/actions/create-changelog"
                  className="ml-4 text-indigo-600 dark:text-indigo-400 underline font-medium hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

        <PricingSection addons={addons} unit_amount={unit_amount} />
        <FAQs />

        <section className="relative py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 border-t border-gray-800">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">
              Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-stretch">
              <div className="group bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-800 hover:border-indigo-500 transition-all duration-200 hover:scale-105">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">
                  Blog
                </h3>
                <p className="text-gray-300 mb-4">
                  Read product updates, best practices, and SaaS growth tips.
                </p>
                <Link
                  href="/blog"
                  className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 transition-colors"
                >
                  Visit Blog
                </Link>
              </div>
              <div className="group bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-800 hover:border-yellow-500 transition-all duration-200 hover:scale-105">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  Docs
                </h3>
                <p className="text-gray-300 mb-4">
                  Explore our documentation for setup, API, and integrations.
                </p>
                <Link
                  href="https://docs.changes.page"
                  className="inline-block px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium shadow hover:bg-yellow-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Docs
                </Link>
              </div>
              <div className="group bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-800 hover:border-pink-500 transition-all duration-200 hover:scale-105">
                <h3 className="text-lg font-semibold text-pink-400 mb-2">
                  Integrations
                </h3>
                <p className="text-gray-300 mb-4">
                  See all available integrations and automation options.
                </p>
                <Link
                  href="/integrations/zapier"
                  className="inline-block px-4 py-2 rounded-lg bg-pink-500 text-white font-medium shadow hover:bg-pink-400 transition-colors"
                >
                  Integrations
                </Link>
              </div>
            </div>
          </div>
        </section>
        <GetStartedHero />
      </main>

      <FooterComponent />
    </div>
  );
}

async function getGitHubStars(): Promise<string | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/techulus/changes-page",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response?.ok) {
      return null;
    }

    const json = await response.json();

    return parseInt(json["stargazers_count"]).toLocaleString();
  } catch (error) {
    return null;
  }
}

export async function getStaticProps() {
  const { unit_amount } = await stripe.prices.retrieve(
    process.env.STRIPE_PRICE_ID
  );
  const { unit_amount: email_unit_amount } = await stripe.prices.retrieve(
    process.env.EMAIL_NOTIFICATION_STRIPE_PRICE_ID
  );
  const stars = await getGitHubStars();

  return {
    props: {
      unit_amount,
      addons: [
        {
          name: "email notification",
          price: email_unit_amount / 100,
        },
      ],
      stars,
    },
    revalidate: 86400,
  };
}
