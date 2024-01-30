import { CheckIcon } from "@heroicons/react/solid";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "../../data/routes.data";
import background from "../../public/images/hero/pricing.jpg";

export default function PricingSection({ unit_amount = 500, addons = [] }) {
  const features = [
    "Email notifications",
    "Custom domain + SSL",
    "Zapier Integration",
    "Embeddable Widget",
    "Post Scheduling",
    "Audience Analytics",
    "SEO Friendly",
    "White labeling",
    "Private pages",
    "AI Assistant",
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-gray-900">
      <div className="relative overflow-hidden pt-24 pb-96 lg:mt-0">
        <div>
          <Image
            className="absolute top-0 left-1/2 w-[1440px] lg:w-full max-w-none rotate-180 -translate-x-1/2 opacity-70"
            src={background}
            alt="Grid"
            width={1440}
            height={693}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-lg font-semibold leading-8 text-indigo-200">
              Simple Pricing
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white hero">
              Everything you need for just ${Number(unit_amount) / 100 || "5"}{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="flow-root pb-32 lg:pb-40">
        <div className="relative -mt-80">
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <div className="mx-auto mt-16 max-w-2xl rounded-3xl border-2 border-indigo-500 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none bg-gray-900">
              <div className="p-8 sm:p-10 lg:flex-auto">
                <div className="flex items-center gap-x-4">
                  <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-500">
                    What&apos;s included
                  </h4>
                  <div className="h-px flex-auto bg-gray-700" />
                </div>
                <ul
                  role="list"
                  className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-200 sm:grid-cols-2 sm:gap-6"
                >
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className="h-6 w-5 flex-none text-indigo-500"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                <div className="rounded-2xl bg-gray-950 py-6 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                  <div className="mx-auto max-w-xs px-8">
                    <p className="mt-6 flex items-baseline justify-center gap-x-2">
                      <div className="hero mt-4 flex items-baseline text-5xl font-bold tracking-tight text-gray-100">
                        ${Number(unit_amount / 100)}
                        <span className="text-lg font-semibold leading-8 tracking-normal text-gray-400">
                          /page /mo
                        </span>
                      </div>
                      <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                        USD
                      </span>
                    </p>

                    {addons?.length ? (
                      <div className="mt-4">
                        <p className="text-base font-medium text-gray-300">
                          + Optional Add-Ons
                        </p>

                        {addons.map(({ price, name }) => (
                          <p key={name}>
                            <span className="text-lg font-bold tracking-tight text-white">
                              ${price}
                            </span>{" "}
                            <span className="text-base font-medium text-gray-300">
                              /{name}
                            </span>
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <Link
                      href={ROUTES.PAGES}
                      className="mt-6 inline-block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white shadow-md hover:bg-indigo-700"
                    >
                      Start free trial
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
