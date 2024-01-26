import { CheckIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import background from "../../public/images/hero/pricing.jpg";

export default function PricingSection({ unit_amount = 500, tiers = [] }) {
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
          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2 lg:gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={classNames(
                    "flex flex-col rounded-3xl bg-gray-800 shadow-xl ring-1 ring-black/10",
                    tier.featured && "border-indigo-500 border-2"
                  )}
                >
                  <div className="p-8 sm:p-10">
                    <h3
                      className="text-lg font-semibold leading-8 tracking-tight text-indigo-400"
                      id={tier.id}
                    >
                      {tier.name}
                    </h3>
                    <div className="hero mt-4 flex items-baseline text-5xl font-bold tracking-tight text-gray-100">
                      ${tier.priceMonthly}
                      <span className="text-lg font-semibold leading-8 tracking-normal text-gray-400">
                        /page /mo
                      </span>
                    </div>
                    <p className="mt-6 text-base leading-7 text-gray-300">
                      {tier.description}
                    </p>

                    {!!tier.addons?.length && (
                      <>
                        <p className="mt-4 mb-1 text-base font-medium text-gray-300">
                          + Optional Add-Ons
                        </p>

                        {tier.addons.map(({ price, name }) => (
                          <p key={name}>
                            <span className="text-lg font-bold tracking-tight text-white">
                              ${price}
                            </span>{" "}
                            <span className="text-base font-medium text-gray-300">
                              /{name}
                            </span>
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-2">
                    <div className="flex flex-1 flex-col justify-between rounded-2xl bg-gray-900 p-6 sm:p-8">
                      <ul role="list" className="space-y-6">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <div className="flex-shrink-0">
                              <CheckIcon
                                className="h-6 w-6 text-indigo-600"
                                aria-hidden="true"
                              />
                            </div>
                            <p className="ml-3 text-sm leading-6 text-gray-300">
                              {feature}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <Link
                          href={tier.href}
                          className="inline-block w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold leading-5 text-white shadow-md hover:bg-indigo-700"
                          aria-describedby={tier.id}
                        >
                          Start free trial
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
