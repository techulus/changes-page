import { CheckIcon, CodeIcon, HeartIcon, TrendingUpIcon, LightningBoltIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";

export default function DevelopersCareAboutChangelog() {
  return (
    <div className="h-full dark:bg-gray-800">
      <Head>
        <title>Why Developers Care About Changelogs - Changes.page</title>
        <meta
          name="description"
          content="Discover why developers value well-maintained changelogs. Learn best practices for creating developer-friendly release notes that build trust, improve adoption, and enhance developer experience."
        />
        <meta name="keywords" content="developers, changelog, release notes, developer experience, API documentation, software updates, version control" />
        <link rel="canonical" href="https://changes.page/developers-care-about-changelog" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Why Developers Care About Changelogs - Changes.page" />
        <meta property="og:description" content="Discover why developers value well-maintained changelogs and learn best practices for creating developer-friendly release notes." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://changes.page/developers-care-about-changelog" />
        <meta property="og:image" content="https://changes.page/og-image.png" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Why Developers Care About Changelogs - Changes.page" />
        <meta name="twitter:description" content="Discover why developers value well-maintained changelogs and learn best practices for creating developer-friendly release notes." />
        <meta name="twitter:image" content="https://changes.page/og-image.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Why Developers Care About Changelogs",
              "description": "Discover why developers value well-maintained changelogs and learn best practices for creating developer-friendly release notes.",
              "author": {
                "@type": "Organization",
                "name": "Changes.page"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Changes.page",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://changes.page/logo.png"
                }
              },
              "datePublished": "2024-01-01",
              "dateModified": "2024-01-01",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://changes.page/developers-care-about-changelog"
              }
            }),
          }}
        />
      </Head>

      <HeaderComponent />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 py-20 sm:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8">
                Developers <span className="underline decoration-blue-500 text-white">Care</span> About
                <br />
                <span className="underline decoration-yellow-500 text-white">Changelogs</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Well-crafted changelogs aren&apos;t just documentation—they&apos;re a bridge of trust between you and the developers who depend on your software.
                Learn why they matter and how to create ones that developers actually love.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-500 transition-colors duration-200"
                >
                  Start Creating Better Changelogs
                </Link>
                <Link
                  href="#why-developers-care"
                  className="inline-flex items-center px-8 py-4 rounded-lg border border-gray-300 text-gray-300 font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Learn Why It Matters
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Developers Care Section */}
        <section id="why-developers-care" className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Developers Actually Care About Changelogs
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                For developers, changelogs aren&apos;t just nice-to-have documentation. They&apos;re essential tools for making informed decisions about updates, debugging issues, and planning integrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-indigo-500">
                <div className="flex items-center mb-4">
                  <LightningBoltIcon className="h-8 w-8 text-indigo-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Risk Assessment
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Developers need to know what changed before updating dependencies. Breaking changes, new features, and bug fixes all affect integration decisions.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-purple-500">
                <div className="flex items-center mb-4">
                  <CodeIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Debugging Context
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  When issues arise, changelogs provide crucial context. They help developers trace problems back to specific updates and understand what might have caused them.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border-l-4 border-pink-500">
                <div className="flex items-center mb-4">
                  <TrendingUpIcon className="h-8 w-8 text-pink-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Feature Discovery
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Detailed changelogs help developers discover new capabilities they can leverage, improving their applications and user experiences.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-indigo-200 dark:border-gray-600">
              <div className="flex items-start">
                <HeartIcon className="h-8 w-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    The Trust Factor
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Developers trust software with transparent communication. Regular, detailed changelogs signal that a project is actively maintained,
                    professionally managed, and respects its user base. This trust directly impacts adoption rates and long-term success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Developers Want Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                What Developers Want in Changelogs
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Not all changelogs are created equal. Here&apos;s what makes a changelog truly valuable for developers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Clear Breaking Changes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Explicitly call out breaking changes with migration guides and impact assessment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Semantic Versioning
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Follow semver conventions so developers can understand the scope of changes at a glance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Code Examples
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Show before/after code examples for significant API changes or new features.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Performance Impact
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Mention performance improvements or potential impacts on resource usage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Security Fixes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Clearly identify security patches without exposing vulnerability details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Deprecation Warnings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Give advance notice of upcoming changes with timelines and alternatives.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Links to Documentation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Reference relevant documentation, pull requests, or issues for additional context.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckIcon className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Consistent Format
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Use a consistent structure and format that&apos;s easy to scan and parse.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                The Impact of Great Changelogs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 mb-6">
                  <TrendingUpIcon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Higher Adoption
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Developers are more likely to adopt and recommend tools with transparent communication.
                </p>
              </div>

              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mb-6">
                  <HeartIcon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Reduced Support
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Clear changelogs reduce support tickets by answering questions before they&apos;re asked.
                </p>
              </div>

              <div className="text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400 mb-6">
                  <LightningBoltIcon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Faster Updates
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Developers update more confidently when they understand what&apos;s changing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Start Building Developer Trust Today
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Join thousands of developers who use Changes.page to create changelogs that their communities actually love and trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-indigo-600 font-semibold shadow-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Create Your First Changelog
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterComponent />
    </div>
  );
}