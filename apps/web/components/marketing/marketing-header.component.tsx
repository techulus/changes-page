import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MARKETING_TITLE } from "../../data/marketing.data";
import { ROUTES } from "../../data/routes.data";
import logoImage from "../../public/images/logo.png";

const navigation = [
  { name: "Pricing", href: ROUTES.PRICING },
  { name: "Zapier Integration", href: ROUTES.ZAPIER },
  { name: "Support", href: ROUTES.SUPPORT, external: true },
];

export default function MarketingHeaderComponent({ title, description }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={logoImage.src} />
      </Head>

      <NextSeo
        title={`${title} | ${MARKETING_TITLE}`}
        description={description}
        openGraph={{
          title: `${title} | ${MARKETING_TITLE}`,
          description,
          type: "website",
          images: [
            {
              url: "https://changes.page/og.png",
              width: 1200,
              height: 630,
              alt: description,
              type: "image/png",
            },
          ],
          siteName: "changes.page",
        }}
        canonical={`https://changes.page${router.asPath}`}
        twitter={{
          handle: "@arjunz",
          site: "@techulus",
          cardType: "summary_large_image",
        }}
      />

      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <Link href={ROUTES.HOME} legacyBehavior>
                    <div className="flex-shrink-0 flex items-center cursor-pointer">
                      <Image
                        className={"w-6 h-6"}
                        src={logoImage}
                        alt="changes.page"
                        width={24}
                        height={24}
                      />
                      <p className="text-gray-50 text-md mx-2 hero">
                        changes<strong>.page</strong>
                      </p>
                    </div>
                  </Link>

                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          target={item.external ? "_blank" : null}
                          rel={item.external ? "noopener noreferrer" : null}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                    <Link
                      href={ROUTES.LOGIN}
                      className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                <Link
                  href={ROUTES.LOGIN}
                  className={classNames(
                    "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                >
                  Sign in
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
