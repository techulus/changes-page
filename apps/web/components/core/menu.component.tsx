import { Menu } from "@headlessui/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import type { JSX } from "react";

export function MenuItem({
  label,
  icon,
  route,
  onClick,
  external = false,
}: {
  label: string;
  icon?: JSX.Element;
  route?: string;
  external?: boolean;
  onClick?: () => any;
}) {
  const router = useRouter();

  if (route && external) {
    return (
      <Menu.Item>
        {({ active }) => (
          <a
            href={route}
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(
              active
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                : "text-gray-900 dark:text-gray-100",
              "group flex items-center px-4 py-2 text-sm cursor-pointer"
            )}
          >
            {icon}
            {label}
          </a>
        )}
      </Menu.Item>
    );
  }

  return (
    <Menu.Item>
      {({ active }) => (
        <div
          className={classNames(
            active
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              : "text-gray-900 dark:text-gray-100",
            "group flex items-center px-4 py-2 text-sm cursor-pointer"
          )}
          onClick={() => {
            if (route) {
              return router.push(route);
            }

            return onClick();
          }}
        >
          {icon}
          {label}
        </div>
      )}
    </Menu.Item>
  );
}
