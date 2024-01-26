import {
  ChevronRightIcon,
  PhotographIcon,
  PlusIcon,
  SpeakerphoneIcon,
  TerminalIcon,
} from "@heroicons/react/outline";
import classNames from "classnames";
import Link from "next/link";
import { useMemo } from "react";
import { IPageSettings } from "@changes-page/supabase/types/page";
import { useUserData } from "../../utils/useUser";

export function EntityEmptyState({
  title,
  message,
  buttonLink,
  buttonLabel,
  disabled = false,
  footer = null,
}) {
  return (
    <div className="text-center h-96 flex flex-col items-center justify-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-50">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {!disabled && (
        <div className="mt-6">
          <Link
            href={buttonLink}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {buttonLabel}
          </Link>
        </div>
      )}
      {footer}
    </div>
  );
}

export const LoadingShimmer = () => (
  <li className="relative ">
    <div className="block pl-4 pr-6 py-5 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 col-span-2 rounded"></div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded col-span-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded col-span-1"></div>
            </div>
          </div>
        </div>
      </div>

      <aside className="hidden lg:block absolute top-4 -right-52 w-48">
        <LoadingButtons count={2} />
      </aside>
    </div>
  </li>
);

export const NewPageOnboarding = ({
  page_id,
  settings,
}: {
  page_id: string;
  settings: IPageSettings;
}) => {
  const { billingDetails } = useUserData();

  const tasks = useMemo(() => {
    const defaultTasks = [
      {
        name: "Add Logo and cover",
        description: "Customize look and feel of the page",
        href: `/pages/${page_id}/settings/general`,
        iconColor: "bg-pink-500",
        icon: PhotographIcon,
        completed: !!(settings?.page_logo || settings?.cover_image),
      },
      {
        name: "Add social links",
        description: "These links will be displayed in page footer",
        href: `/pages/${page_id}/settings/links`,
        iconColor: "bg-blue-500",
        icon: SpeakerphoneIcon,
        completed: !!(
          settings?.twitter_url ||
          settings?.github_url ||
          settings?.instagram_url ||
          settings?.facebook_url
        ),
      },
    ];

    const premiumTasks = [
      {
        name: "Setup custom domain",
        description: "Use your own domain name to publish the page.",
        href: `/pages/${page_id}/settings/general`,
        iconColor: "bg-purple-500",
        icon: TerminalIcon,
        completed: !!settings?.custom_domain,
      },
    ];

    return billingDetails?.hasActiveSubscription
      ? [...defaultTasks, ...premiumTasks]
      : defaultTasks;
  }, [billingDetails?.hasActiveSubscription, settings, page_id]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 md:py-28">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Welcome to your new page
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by setting up your page or write your first post.
      </p>
      <ul
        role="list"
        className="mt-6 border-t border-b border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800"
      >
        {tasks.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="relative group py-4 flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span
                  className={classNames(
                    item.iconColor,
                    "inline-flex items-center justify-center h-10 w-10 rounded-lg"
                  )}
                >
                  <item.icon
                    className="h-6 w-6 text-white dark:text-gray-900"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={classNames(
                    "text-sm  text-gray-900 dark:text-gray-100",
                    (item.completed &&
                      "line-through font-medium text-gray-500 dark:text-gray-400") ||
                      "font-semibold"
                  )}
                >
                  <Link href={item.href}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
              <div className="flex-shrink-0 self-center">
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex">
        <Link
          href={`/pages/${page_id}/new`}
          className="text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
        >
          Or write your first post<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export const LoadingButtons = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="block px-3 py-2">
      <div className="animate-pulse">
        <div className="h-5 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>

        {/*Show count number of items the div below*/}
        {[...Array(count ? count - 1 : 0)].map((_, i) => (
          <div
            key={i}
            className="h-5 w-full bg-gray-200 dark:bg-gray-600 rounded mt-2"
          ></div>
        ))}
      </div>
    </div>
  );
};
