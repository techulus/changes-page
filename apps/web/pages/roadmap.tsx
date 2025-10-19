import {
  ChartBarIcon,
  CheckIcon,
  CursorClickIcon,
  LightBulbIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";

export default function RoadmapLanding() {
  return (
    <div className="h-full dark:bg-gray-800">
      <Head>
        <title>Interactive Product Roadmaps with Voting - Changes.page</title>
        <meta
          name="description"
          content="Build transparent public roadmaps with community voting. Engage users, prioritize features together, and share your product vision. Start creating interactive roadmap boards today."
        />
        <meta
          name="keywords"
          content="product roadmap, roadmap software, public roadmap, feature voting, community feedback, product planning, roadmap board, interactive roadmap"
        />
        <link rel="canonical" href="https://changes.page/roadmap" />

        <meta
          property="og:title"
          content="Interactive Product Roadmaps with Voting - Changes.page"
        />
        <meta
          property="og:description"
          content="Build transparent public roadmaps with community voting. Engage users, prioritize features together, and share your product vision."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://changes.page/roadmap" />
        <meta property="og:image" content="https://changes.page/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Interactive Product Roadmaps with Voting - Changes.page"
        />
        <meta
          name="twitter:description"
          content="Build transparent public roadmaps with community voting. Engage users, prioritize features together, and share your product vision."
        />
        <meta
          name="twitter:image"
          content="https://changes.page/og-image.png"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Changes.page Roadmap Boards",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                priceValidUntil: "2025-12-31",
              },
              description:
                "Build transparent public roadmaps with community voting. Engage users, prioritize features together, and share your product vision.",
              operatingSystem: "Web",
              url: "https://changes.page/roadmap",
              screenshot: "https://changes.page/og-image.png",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "250",
              },
              featureList: [
                "Interactive roadmap boards",
                "Community feature voting",
                "Custom board statuses",
                "Public or private boards",
                "Real-time engagement analytics",
                "User idea submission",
                "Custom branding and domains",
                "Email notifications for voters",
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is a product roadmap?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A product roadmap is a visual plan that shows the direction and priorities of your product development. It helps communicate your product vision, upcoming features, and timeline to stakeholders and users.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can users vote on roadmap items?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, Changes.page roadmap boards include built-in voting functionality. Users can upvote features they want, helping you prioritize development based on real community demand.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I make my roadmap public?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can choose to make your roadmap board public or keep it private. Public roadmaps help build transparency and trust with your user community.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can users submit their own feature ideas?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can enable user submissions so your community can propose new feature ideas directly on your roadmap board. You can review and approve submissions before they appear.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I customize the roadmap board?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can customize board statuses, use your own branding and colors, and even use a custom domain for your roadmap page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I track engagement on my roadmap?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can see which features are getting the most votes from your community, helping you understand what your users care about most.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      <HeaderComponent />

      <main>
        <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                <SparklesIcon className="h-5 w-5 text-indigo-400 mr-2" />
                <span className="text-sm font-medium text-indigo-300">
                  Build in Public with Confidence
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8">
                Share Your Product Vision
                <br />
                with{" "}
                <span className="underline decoration-purple-500 text-white">
                  Interactive Roadmaps
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Create transparent public roadmaps that let your community vote
                on features, submit ideas, and track progress. Build trust
                through transparency and prioritize what matters most to your
                users.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 transition-colors duration-200"
                >
                  Start Your Free Roadmap
                </Link>
                <Link
                  href="https://hey.changes.page/roadmap/platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 rounded-lg border border-gray-300 text-gray-300 font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  View Live Demo
                </Link>
              </div>
              <p className="text-gray-400 mt-6 text-sm">
                Free 14-day trial • Setup in minutes
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need for Community-Driven Planning
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Powerful roadmap boards designed to engage your community and
                make product decisions together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-4">
                    <CursorClickIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Community Voting
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Let users upvote the features they want most. See what your
                  community truly values and prioritize development based on
                  real demand.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                    <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    User Idea Submission
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Enable users to submit their own feature ideas. Review,
                  approve, and add the best suggestions to your roadmap with one
                  click.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-pink-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900 mr-4">
                    <ChartBarIcon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Custom Board Statuses
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Organize features with custom statuses like Planned, In
                  Progress, Shipped, or any workflow that fits your team.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-4">
                    <UserGroupIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Public or Private
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose to make your roadmap public for transparency or keep it
                  private for internal planning. Switch anytime with a single
                  click.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                    <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Vote Tracking
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  See which features are getting the most votes from your
                  community and prioritize accordingly.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                    <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Custom Branding
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Use your own domain, logo, and colors to create a branded
                  roadmap experience that feels native to your product.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Product Teams Love Roadmap Boards
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Build Transparency and Trust
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Show users what you&apos;re working on
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Public roadmaps demonstrate commitment and build
                      excitement for upcoming features
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Reduce feature request emails
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Users can check if their idea is already planned instead
                      of asking support
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Validate ideas before building
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Gauge interest through voting before investing development
                      resources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Perfect for Every Team
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  SaaS Companies
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share your product vision publicly, engage users in feature
                  prioritization, and build excitement for what&apos;s next.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Product Managers
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Collect feedback, validate ideas with voting, and align
                  stakeholders around a transparent product strategy.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Indie Hackers
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build in public with confidence, involve your early adopters
                  in decisions, and create a loyal community around your
                  product.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                How It Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Create Your Board
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Set up your roadmap board in minutes. Add custom statuses,
                    configure voting, and enable user submissions.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Add Features & Ideas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Populate your roadmap with planned features. Let users
                    submit and vote on ideas they care about most.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 shadow-lg mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Share & Engage
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Share your public roadmap URL. Update progress, move items
                    across statuses, and notify engaged voters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  What is a product roadmap?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A product roadmap is a visual plan that shows the direction
                  and priorities of your product development. It helps
                  communicate your product vision, upcoming features, and
                  timeline to stakeholders and users.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Can users vote on roadmap items?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, Changes.page roadmap boards include built-in voting
                  functionality. Users can upvote features they want, helping
                  you prioritize development based on real community demand.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Can I make my roadmap public?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can choose to make your roadmap board public or keep
                  it private. Public roadmaps help build transparency and trust
                  with your user community.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Can users submit their own feature ideas?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can enable user submissions so your community can
                  propose new feature ideas directly on your roadmap board. You
                  can review and approve submissions before they appear.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Can I customize the roadmap board?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can customize board statuses, use your own branding
                  and colors, and even use a custom domain for your roadmap
                  page.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  How do I track engagement on my roadmap?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You can see which features are getting the most votes from
                  your community, helping you understand what your users care
                  about most.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Start Building Your Roadmap Today
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join thousands of product teams using Changes.page to build
              transparent roadmaps that engage their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-indigo-600 font-semibold shadow-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Create Your Free Roadmap
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200"
              >
                View Pricing
              </Link>
            </div>
            <p className="text-gray-300 mt-6 text-sm">
              14-day free trial • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <FooterComponent />
    </div>
  );
}
