import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { NextSeo } from "next-seo";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { DEFAULT_TITLE, SUBTITLE, TAGLINE } from "../../data/marketing.data";
import { ROUTES } from "../../data/routes.data";
import logoImage from "../../public/images/logo.png";
import userImage from "../../public/images/user.png";
import usePrefersColorScheme from "../../utils/hooks/usePrefersColorScheme";
import { useUserData } from "../../utils/useUser";
import { MenuItem } from "../core/menu.component";
import { createToastWrapper } from "../core/toast.component";

export default function HeaderComponent() {
  const { loading, user, billingDetails, signOut, supabase } = useUserData();
  const router = useRouter();
  const prefersColorScheme = usePrefersColorScheme();

  const [hasPendingInvites, setHasPendingInvites] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("team_invitations")
      .select("id")
      .eq("status", "pending")
      .eq("email", user.email)
      .then(({ data }) => {
        setHasPendingInvites(data?.length > 0);
      });
  }, [user]);

  const navigation = useMemo(() => {
    if (user) {
      return [
        { name: "Pages", href: ROUTES.PAGES },
        { name: "Teams", href: ROUTES.TEAMS, pulse: hasPendingInvites },
        { name: "Zapier", href: ROUTES.ZAPIER },
        { name: "Billing", href: ROUTES.BILLING },
        { name: "Support", href: ROUTES.SUPPORT, external: true },
      ];
    }

    return [
      { name: "Pricing", href: ROUTES.PRICING },
      { name: "Automate using Zapier", href: ROUTES.ZAPIER },
      { name: "Knowledge base", href: ROUTES.DOCS, external: true },
      { name: "Support", href: ROUTES.SUPPORT, external: true },
    ];
  }, [user, billingDetails]);

  return (
    <>
      {createToastWrapper(prefersColorScheme)}

      <Head>
        <title>{DEFAULT_TITLE}</title>
        <link rel="shortcut icon" href={logoImage.src} />
      </Head>

      <NextSeo
        title={DEFAULT_TITLE}
        description={SUBTITLE}
        openGraph={{
          title: DEFAULT_TITLE,
          description: SUBTITLE,
          type: "website",
          images: [
            {
              url: `https://changes.page/api/blog/og?tag=${encodeURIComponent(
                "changes.page"
              )}&title=${TAGLINE}&content=${SUBTITLE}&logo=https://changes.page/images/logo.png`,
              width: 1200,
              height: 630,
              alt: SUBTITLE,
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

      <Disclosure as="nav" className="bg-gray-900">
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
                        width={24}
                        height={24}
                        className={"w-6 h-6"}
                        src={logoImage}
                        alt="changes.page"
                      />
                      <p className="text-gray-50 text-md mx-2 hero">
                        changes<strong>.page</strong>
                      </p>
                    </div>
                  </Link>

                  {loading ? (
                    <div className="hidden sm:flex sm:ml-6 animate-pulse flex-row items-center space-x-4">
                      <div className="rounded-md bg-gray-700 h-6 w-14"></div>
                      <div className="rounded-md bg-gray-700 h-6 w-14"></div>
                      <div className="rounded-md bg-gray-700 h-6 w-14"></div>
                    </div>
                  ) : (
                    <div className="hidden sm:block sm:ml-6">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.href == router.pathname
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={
                              item.href == router.pathname ? "page" : undefined
                            }
                            target={item.external ? "_blank" : null}
                            rel={item.external ? "noopener noreferrer" : null}
                          >
                            {item.name}
                            {item.pulse ? (
                              <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse"></span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  {user ? (
                    <Menu as="div" className="ml-3 relative">
                      {({ open }) => (
                        <>
                          <div>
                            <Menu.Button className="bg-gray-800 flex text-sm focus:outline-none">
                              <span className="sr-only">Open user menu</span>
                              {user?.user_metadata?.avatar_url ? (
                                <img
                                  className="rounded-full w-6 h-6"
                                  alt="account"
                                  src={user.user_metadata.avatar_url}
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <Image
                                  className="rounded-full w-6 h-6"
                                  alt="account"
                                  src={userImage.src}
                                  width={24}
                                  height={24}
                                />
                              )}
                            </Menu.Button>
                          </div>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg dark:shadow-gray-700 py-1 bg-white dark:bg-gray-900 dark:divide-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50  border-indigo-300 dark:border-indigo-800 border-2"
                            >
                              {user && (
                                <Menu.Item>
                                  <div
                                    className={classNames(
                                      "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
                                      "border-b border-gray-200 dark:border-gray-700"
                                    )}
                                  >
                                    {!!user?.user_metadata?.full_name && (
                                      <p className="font-semibold">
                                        {user?.user_metadata?.full_name}

                                        {billingDetails?.has_active_subscription && (
                                          <BadgeCheckIcon className="inline ml-1 -mt-1 w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                        )}
                                      </p>
                                    )}
                                    <p className="mt-1 truncate">
                                      {user?.email}
                                    </p>
                                  </div>
                                </Menu.Item>
                              )}

                              <MenuItem label="Pages" route={ROUTES.PAGES} />

                              {(!!billingDetails?.subscription && (
                                <MenuItem
                                  label="Billing"
                                  route={ROUTES.BILLING}
                                />
                              )) ||
                                false}

                              <MenuItem
                                label="Sign out"
                                onClick={() => signOut()}
                              />
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  ) : (
                    <>
                      <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                        <Link
                          href={ROUTES.LOGIN}
                          className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Sign in
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={classNames(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                  >
                    {item.name}
                    {item.pulse ? (
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 animate-pulse"></span>
                    ) : null}
                  </Disclosure.Button>
                ))}

                {!user && (
                  <Link
                    href={ROUTES.LOGIN}
                    className={classNames(
                      "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
