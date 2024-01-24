import { Menu, Transition } from "@headlessui/react";
import { ArrowLeftIcon, CogIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, ReactNode } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useUserData } from "../../utils/useUser";
import BillingBanner from "../billing/billing-banner";

export default function Page({
  title,
  subtitle,
  buttons,
  menuItems,
  children,
  backRoute,
  showBackButton = false,
  fullWidth = false,
  legalPage = false,
  tabs = [],
}: {
  title: string;
  subtitle?: ReactNode;
  buttons?: ReactNode;
  menuItems?: ReactNode;
  children?: ReactNode;
  backRoute?: string;
  showBackButton?: boolean;
  fullWidth?: boolean;
  legalPage?: boolean;
  tabs?: {
    name: string;
    href: string;
    current: boolean;
  }[];
}) {
  const router = useRouter();
  const { user } = useUserData();

  useHotkeys(
    "esc",
    () => {
      if (router.pathname === "/") return;
      if (router.pathname === "/pages") return;

      if (backRoute) {
        void router.replace(backRoute);
        return;
      }

      router.back();
    },
    [router, backRoute]
  );

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow dark:shadow-sm dark:shadow-gray-700/50 sticky top-0 z-10 backdrop-filter backdrop-blur-lg bg-opacity-70 dark:bg-opacity-70">
        <div
          className={classNames(
            "max-w-7xl mx-auto py-6 sm:py-2 px-4 sm:px-6 lg:px-8",
            !subtitle && "py-4 sm:py-4",
            !!title && tabs.length > 0 && "relative sm:pb-0 lg:pb-2"
          )}
        >
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-start min-w-0">
              {showBackButton && (
                <button
                  onClick={() =>
                    (backRoute && router.replace(backRoute)) || router.back()
                  }
                  className="flex items-center text-md font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400 mr-3 sm:mt-1.5"
                >
                  <ArrowLeftIcon
                    className="flex-shrink-0 -ml-1 mr-1 h-6 w-6 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              )}

              <div>
                {title ? (
                  <h2 className="text-2xl font-bold leading-7 tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl sm:truncate hero">
                    {title}
                  </h2>
                ) : (
                  <div className="animate-pulse mt-1.5">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                )}

                {subtitle && (
                  <>
                    {title ? (
                      <div className="mt-1 text-gray-900 dark:text-gray-50 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        {subtitle}
                      </div>
                    ) : (
                      <div className="animate-pulse mt-1.5">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {title
              ? !!(
                  React.Children.count(buttons) ||
                  React.Children.count(menuItems)
                ) && (
                  <div className="flex lg:mt-0 lg:ml-4">
                    {buttons}

                    {/* Dropdown */}
                    {(React.Children.count(menuItems) && (
                      <Menu as="span" className="ml-3 relative">
                        <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <CogIcon
                            className="h-5 w-5 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                          />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 border-indigo-300 dark:border-indigo-800 border-2">
                            {menuItems}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )) ||
                      false}
                  </div>
                )
              : false}
          </div>

          {!!title && tabs?.length > 0 && (
            <div className="mt-2 lg:absolute lg:right-8 lg:top-8 lg:pt-2">
              <div className="sm:hidden">
                <label htmlFor="current-tab" className="sr-only">
                  Select a tab
                </label>
                <select
                  id="current-tab"
                  name="current-tab"
                  className="block w-full rounded-md dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  defaultValue={tabs.find((tab) => tab.current)?.name}
                  onChange={(e) => router.push(e?.target?.value)}
                >
                  {tabs.map((tab) => (
                    <option key={tab.name} value={tab.href}>
                      {tab.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <Link
                      key={tab.name}
                      href={tab.href}
                      className={classNames(
                        tab.current
                          ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300",
                        "whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm"
                      )}
                      aria-current={tab.current ? "page" : undefined}
                    >
                      {tab.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="bg-gray-100 dark:bg-gray-800">
        {user && <BillingBanner />}

        <div
          className={classNames(
            "mx-auto py-6",
            !fullWidth && "max-w-7xl sm:px-6 lg:px-8",
            legalPage && "px-4"
          )}
        >
          {children}
        </div>
      </main>
    </>
  );
}
