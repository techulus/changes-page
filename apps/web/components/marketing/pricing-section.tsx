import { CheckIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { ROUTES } from "../../data/routes.data";

interface Addon {
  price: number;
  name: string;
}

interface PricingSectionProps {
  unit_amount?: number;
  addons?: Addon[];
}

export default function PricingSection({
  unit_amount = 200,
  addons = [],
}: PricingSectionProps) {
  const priceInDollars = unit_amount / 100;
  const features = [
    "Markdown editor with image uploads",
    "Public roadmap with community voting",
    "Post scheduling, reactions & pinned posts",
    "Team collaboration & member invites",
    "Custom domain + SSL",
    "GitHub Changelog Agent",
    "Audience analytics",
    "JSON API & RSS feed",
    "React SDK & embeddable widget",
    "Zapier & GitHub integration",
    "CLI + API access",
    "Email notifications (add-on)",
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold leading-8 text-indigo-600 dark:text-indigo-400">
            Simple Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white hero">
            One plan. Everything included.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-gray-200 dark:border-gray-700 lg:mx-0 lg:flex lg:max-w-none bg-white dark:bg-gray-950">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <ul
              role="list"
              className="grid grid-cols-1 gap-2 text-sm leading-6 text-gray-700 dark:text-gray-300 sm:grid-cols-2 sm:gap-3"
            >
              {features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-500"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-gray-500">
              Fair usage applies to storage and bandwidth per page. We
              don&apos;t impose hard limits, but may reach out if usage
              significantly exceeds typical patterns.
            </p>
          </div>
          <div className="p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 py-6 text-center ring-1 ring-inset ring-gray-200 dark:ring-gray-800 lg:flex lg:flex-col lg:justify-center lg:py-20">
              <div className="mx-auto max-w-xs px-8">
                <div className="mt-6 flex items-baseline justify-center gap-x-2">
                  <p className="hero mt-4 flex items-baseline text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                    ${priceInDollars}
                    <span className="text-lg font-semibold leading-8 tracking-normal text-gray-500 dark:text-gray-400">
                      /page /mo
                    </span>
                  </p>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-500">
                    USD
                  </span>
                </div>

                {addons?.length ? (
                  <div className="mt-4">
                    <p className="text-base font-medium text-gray-500 dark:text-gray-400">
                      + Optional Add-Ons
                    </p>

                    {addons.map(({ price, name }) => (
                      <p key={name}>
                        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                          ${price}
                        </span>{" "}
                        <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                          /{name}
                        </span>
                      </p>
                    ))}
                  </div>
                ) : null}

                <Link
                  href={ROUTES.PAGES}
                  className="mt-6 inline-block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  Start free trial
                </Link>
                <p className="text-xs mt-2 text-gray-500">
                  14-day free trial, no credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
