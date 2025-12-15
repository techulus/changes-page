import {
  ChatAlt2Icon,
  CheckIcon,
  CogIcon,
  LightningBoltIcon,
  SparklesIcon,
  TerminalIcon,
} from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";

export default function GitHubChangelogAgentLanding() {
  return (
    <div className="h-full dark:bg-gray-800">
      <Head>
        <title>
          GitHub Changelog Agent - AI-Powered Changelog Generation from PRs
        </title>
        <meta
          name="description"
          content="Automatically generate beautiful changelog entries from your GitHub pull requests. Just mention @changespage in your PR and let AI create user-friendly release notes."
        />
        <meta
          name="keywords"
          content="github changelog, ai changelog generator, pull request changelog, automated release notes, github integration, changelog automation, developer tools"
        />
        <link
          rel="canonical"
          href="https://changes.page/github-changelog-agent"
        />

        <meta
          property="og:title"
          content="GitHub Changelog Agent - AI-Powered Changelog Generation"
        />
        <meta
          property="og:description"
          content="Automatically generate beautiful changelog entries from your GitHub pull requests. Just mention @changespage in your PR."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://changes.page/github-changelog-agent"
        />
        <meta property="og:image" content="https://changes.page/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="GitHub Changelog Agent - AI-Powered Changelog Generation"
        />
        <meta
          name="twitter:description"
          content="Automatically generate beautiful changelog entries from your GitHub pull requests. Just mention @changespage in your PR."
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
              name: "Changes.page GitHub Changelog Agent",
              applicationCategory: "DeveloperApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                priceValidUntil: "2025-12-31",
              },
              description:
                "AI-powered changelog generation from GitHub pull requests. Mention @changespage in your PR to automatically create user-friendly release notes.",
              operatingSystem: "Web",
              url: "https://changes.page/github-changelog-agent",
              screenshot: "https://changes.page/og-image.png",
              featureList: [
                "AI-powered changelog generation",
                "GitHub pull request integration",
                "Custom AI instructions per repository",
                "One-click draft creation",
                "Multi-repository support",
                "Seamless workflow integration",
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
                  name: "How does the GitHub Changelog Agent work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Simply mention @changespage in any GitHub pull request comment. The agent analyzes the PR changes and generates a user-friendly changelog draft that you can review and publish.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I customize how changelogs are generated?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can provide custom AI instructions for each connected repository. For example, you can specify the tone, focus on user-facing changes, or include specific details like author names.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Which repositories can I connect?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can connect any GitHub repository where you have permission to install GitHub Apps. Each repository can be linked to a specific changelog page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is the generated changelog published automatically?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, generated changelogs are saved as drafts. You have full control to review, edit, and publish them when ready.",
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
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 animate-pulse" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
                <SparklesIcon className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm font-medium text-green-300">
                  AI-Powered changelog agent
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8">
                Generate Changelogs
                <br />
                from{" "}
                <span className="underline decoration-green-500 text-white">
                  GitHub PRs
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Mention{" "}
                <code className="px-2 py-1 bg-gray-800 rounded text-green-400">
                  @changespage
                </code>{" "}
                in any pull request and let AI transform your code changes into
                beautiful, user-friendly changelog posts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-green-600 text-white font-semibold shadow-lg hover:bg-green-500 transition-colors duration-200"
                >
                  Get Started Free
                </Link>
                <Link
                  href="https://github.com/apps/changes-page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 rounded-lg border border-gray-300 text-gray-300 font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Install GitHub App
                </Link>
              </div>
              <p className="text-gray-400 mt-6 text-sm">
                Free 14-day trial • Works with any GitHub repository
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Three simple steps to automated changelog generation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 shadow-lg mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Connect Your Repo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Install the Changes.page GitHub App and connect your
                    repository to your page. Takes less than a minute.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-lg mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Mention @changespage
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    When your PR is ready, mention @changespage in a comment.
                    The agent analyzes your changes and generates a changelog
                    draft.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 shadow-lg mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Review & Publish
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    The changelog draft appears in your dashboard. Review it,
                    make any edits, and publish when ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

        <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Powerful Features for Developer Teams
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Everything you need to automate your changelog workflow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 mr-4">
                    <SparklesIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    AI-Powered Writing
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Transforms technical code changes into user-friendly changelog
                  entries. Focuses on what matters to your users, not
                  implementation details.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 mr-4">
                    <ChatAlt2Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Simple Trigger
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Just mention @changespage in any PR comment. No complex
                  configuration, no special syntax. Works naturally in your
                  existing workflow.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900 mr-4">
                    <CogIcon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Custom Instructions
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Provide custom AI instructions per repository. Control the
                  tone, focus areas, and specific details to include in
                  generated changelogs.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900 mr-4">
                    <TerminalIcon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Multi-Repo Support
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect multiple repositories to different changelog pages.
                  Perfect for organizations with multiple products or
                  microservices.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                    <LightningBoltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Instant Drafts
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Changelogs are generated in seconds and saved as drafts. Full
                  control to review, edit, and publish on your own schedule.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-4">
                    <svg
                      className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Native GitHub Integration
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Uses the official GitHub App for secure, native integration.
                  No tokens to manage, no webhooks to configure.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Developer Teams Love It
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Save hours of writing time
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      No more context-switching to write changelogs. Generate
                      them directly from the PR where the context is fresh.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Consistent, professional quality
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      AI ensures every changelog follows the same style and
                      focuses on user impact, regardless of who wrote the PR.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Never miss a release note
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Generate changelogs as part of your PR workflow. Every
                      merged feature gets documented.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Full control over publishing
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Generated changelogs are drafts. Review, combine multiple
                      PRs, or batch releases - publish when you&apos;re ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-gray-200 dark:bg-gray-800" />

        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  How does the GitHub Changelog Agent work?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simply mention @changespage in any GitHub pull request
                  comment. The agent analyzes the PR changes and generates a
                  user-friendly changelog draft that you can review and publish.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Can I customize how changelogs are generated?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can provide custom AI instructions for each connected
                  repository. For example, you can specify the tone, focus on
                  user-facing changes, or include specific details like author
                  names.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Which repositories can I connect?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You can connect any GitHub repository where you have
                  permission to install GitHub Apps. Each repository can be
                  linked to a specific changelog page.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Is the generated changelog published automatically?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  No, generated changelogs are saved as drafts. You have full
                  control to review, edit, and publish them when ready.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Can I disable the agent for specific repositories?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, each connected repository has an enable/disable toggle.
                  You can temporarily disable the agent without disconnecting
                  the repository.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Ready to Automate Your Changelogs?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join developer teams using the GitHub Changelog Agent to save time
              and never miss a release note.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-green-600 font-semibold shadow-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started Free
              </Link>
              <Link
                href="https://github.com/apps/changes-page"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200"
              >
                Install GitHub App
              </Link>
            </div>
            <p className="text-gray-300 mt-6 text-sm">
              14-day free trial • No credit card required
            </p>
          </div>
        </section>
      </main>

      <FooterComponent />
    </div>
  );
}
