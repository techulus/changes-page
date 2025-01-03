import { InboxIcon, SparklesIcon } from "@heroicons/react/outline";
import Head from "next/head";
import Image from "next/image";
import FooterComponent from "../../components/layout/footer.component";
import HeaderComponent from "../../components/layout/header.component";
import Page from "../../components/layout/page.component";
import zapierGitHub from "../../public/images/zapier/github.png";
import zapierTweet from "../../public/images/zapier/tweet.png";

export default function Zapier() {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-800">
      <HeaderComponent />
      <Head>
        <script
          type="module"
          src="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.esm.js"
        ></script>
        <link
          rel="stylesheet"
          href="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.css"
        />
      </Head>

      <Page title="Zapier Integration" fullWidth>
        <div className="relative pb-32 overflow-hidden">
          <div className="relative">
            <div className="lg:mx-auto lg:max-w-7xl text-center">
              <zapier-workflow
                client-id="rnKv828fHE7sPhcZdGhwqWbIsJkOfhUEh2RAHQw4"
                theme="auto"
                intro-copy-display="show"
                guess-zap-display="show"
              />
            </div>

            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24 mt-24">
              <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-16 lg:max-w-none lg:mx-0 lg:px-0">
                <div>
                  <div className="hidden lg:block">
                    <span className="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
                      <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                      Tweet when you create a post
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                      Share your new posts on Twitter so that customers are in
                      the loop with latest changes in your product.
                    </p>
                    <div className="mt-6">
                      <a
                        href="https://zapier.com/developer/public-invite/156052/c952eac2cc1df107ce2c1ff82feddc19/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Get started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="pl-4 -mr-48 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                  <Image
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={zapierTweet.src}
                    alt="Post to Tweet"
                    width={667}
                    height={374}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
              <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
                <div className="hidden lg:block">
                  <span className="h-12 w-12 rounded-md flex items-center justify-center bg-indigo-600">
                    <SparklesIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="mt-6">
                  <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                    Sync GitHub releases
                  </h2>
                  <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                    Automatically create a new post in your changes page every
                    time you publish a new release in GitHub.
                  </p>
                  <div className="mt-6">
                    <a
                      href="https://zapier.com/developer/public-invite/156052/c952eac2cc1df107ce2c1ff82feddc19/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Get started
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
                <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                  <Image
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={zapierGitHub.src}
                    alt="Copy releases from GitHub"
                    width={892}
                    height={502}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>

      <FooterComponent />
    </div>
  );
}
