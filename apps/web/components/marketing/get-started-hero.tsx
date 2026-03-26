import Link from "next/link";
import { ROUTES } from "../../data/routes.data";

export default function GetStartedHero() {
  return (
    <div className="bg-white dark:bg-gray-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white hero">
            Start shipping updates today
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            14-day free trial. No credit card required.
          </p>

          <div className="mt-10">
            <Link
              href={ROUTES.PAGES}
              className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Create your page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
