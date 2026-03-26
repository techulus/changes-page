import { ChevronRightIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "../../data/routes.data";
import capture from "../../public/images/hero/capture.png";
import { Post } from "@changespage/react";
const version = require("../../package.json").version;

function AppScreenshot() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl max-h-[600px]">
      <Image
        src={capture}
        alt="Changes.page changelog with timeline posts, reactions, and email subscriptions"
        width={800}
        height={762}
        className="w-full"
        priority
      />
    </div>
  );
}

function TerminalMockup() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-950 overflow-hidden shadow-2xl max-h-[450px] flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/60 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-gray-700" />
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-xs text-gray-500 font-mono">~/ project</span>
        </div>
      </div>
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-normal overflow-x-auto flex-1">
        <div className="space-y-0.5">
          <div>
            <span className="text-green-400">$ </span>
            <span className="text-white">chp posts create \</span>
          </div>
          <div className="pl-4">
            <span className="text-indigo-300">--title </span>
            <span className="text-yellow-300">&quot;v2.4.0 Release&quot;</span>
            <span className="text-white"> \</span>
          </div>
          <div className="pl-4">
            <span className="text-indigo-300">--tags </span>
            <span className="text-white">new,improvement \</span>
          </div>
          <div className="pl-4">
            <span className="text-indigo-300">--status </span>
            <span className="text-white">published \</span>
          </div>
          <div className="pl-4">
            <span className="text-indigo-300">--body </span>
            <span className="text-yellow-300">&quot;## What&apos;s New</span>
          </div>
          <div className="pl-4">
            <span className="text-yellow-300">- Dark mode support</span>
          </div>
          <div className="pl-4">
            <span className="text-yellow-300">- Faster page loads&quot;</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/5">
          <div className="text-green-400 mb-3">
            &#10003; Post published successfully
          </div>
          <div className="text-gray-600 space-y-0.5">
            <div>
              <span className="text-gray-500">&quot;id&quot;</span>
              <span className="text-gray-600">{`: `}</span>
              <span className="text-gray-400">&quot;post_k8f2...&quot;</span>
            </div>
            <div>
              <span className="text-gray-500">&quot;title&quot;</span>
              <span className="text-gray-600">{`: `}</span>
              <span className="text-gray-400">&quot;v2.4.0 Release&quot;</span>
            </div>
            <div>
              <span className="text-gray-500">&quot;status&quot;</span>
              <span className="text-gray-600">{`: `}</span>
              <span className="text-green-400/70">&quot;published&quot;</span>
            </div>
            <div>
              <span className="text-gray-500">&quot;url&quot;</span>
              <span className="text-gray-600">{`: `}</span>
              <span className="text-indigo-400/70">&quot;hey.changes.page/post/v240&quot;</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-green-400">$ </span>
          <span className="text-gray-600">|</span>
        </div>
      </div>
    </div>
  );
}

function CopyableCommand() {
  const [copied, setCopied] = useState(false);
  const command = "npm install -g @changespage/cli";

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="group flex items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2.5 font-mono text-sm text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
    >
      <span className="text-indigo-500 dark:text-green-400">$</span>
      <span>{command}</span>
      <span className="text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
        {copied ? (
          <svg className="h-4 w-4 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default function Hero({
  latestPost = null,
}: {
  latestPost: Post | null;
}) {
  return (
    <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:py-40 lg:px-8">
        <div className="max-w-2xl">
          {latestPost && (
            <div className="mb-8">
              <Link
                href="/changelog"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3"
              >
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                  NEW
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium leading-6 text-gray-600 dark:text-gray-300 truncate max-w-[200px] sm:max-w-none">
                  <span className="truncate">{latestPost.title}</span>
                  <ChevronRightIcon
                    className="h-4 w-4 text-gray-400 dark:text-gray-500"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl hero">
            The changelog platform for{" "}
            <span className="italic text-indigo-600 dark:text-indigo-400">humans</span>{" "}
            and{" "}
            <span className="italic text-indigo-600 dark:text-indigo-400">agents</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-xl">
            Craft changelogs in a beautiful editor or push them from your CI/CD
            pipeline. One platform, two interfaces.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href={ROUTES.PAGES}
              className="rounded-md bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Get Started Free
            </Link>

            <div className="hidden sm:block">
              <CopyableCommand />
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-3">
              Changelog
            </p>
            <AppScreenshot />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-green-400 mb-3">
              CLI &amp; API
            </p>
            <TerminalMockup />
          </div>
        </div>
      </div>
    </div>
  );
}
