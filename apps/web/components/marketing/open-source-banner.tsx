import Link from "next/link";

export default function OpenSourceBanner({
  stars,
}: {
  stars: string | null;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] px-8 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <div className="max-w-md">
              <p className="text-sm font-medium tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-3">
                Open Source
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl hero">
                Built in public
              </h2>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                Star us on GitHub, report issues, or contribute directly.
              </p>
            </div>

            <Link
              href="https://github.com/techulus/changes-page"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-3 self-start rounded-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/[0.04] px-6 py-3 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/[0.08] hover:border-gray-400 dark:hover:border-white/20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Star on GitHub
              {stars ? (
                <span className="inline-flex items-center rounded-md bg-gray-200 dark:bg-white/10 px-2.5 py-0.5 text-sm tabular-nums">
                  {stars}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
