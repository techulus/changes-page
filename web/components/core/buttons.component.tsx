import classNames from "classnames";
import Link from "next/link";
import { KbdPrimary, KbdSecondary } from "./kbd.component";

export function PrimaryRouterButton({
  label,
  route,
  icon,
  className,
  keyboardShortcut,
}: {
  label: string;
  route: string;
  icon: JSX.Element;
  className?: string;
  keyboardShortcut?: string;
}) {
  return (
    <Link
      href={route}
      className={classNames(
        "inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-auto",
        className
      )}
    >
      {icon}
      {label}
      {keyboardShortcut && <KbdPrimary keyboardShortcut={keyboardShortcut} />}
    </Link>
  );
}

export function SecondaryRouterButton({
  label,
  route,
  className,
  icon = null,
  external = false,
  hideLabel = false,
}: {
  label: string;
  route: string;
  className?: string;
  icon?: JSX.Element;
  external: boolean;
  hideLabel?: boolean;
}) {
  return (
    <Link href={route} legacyBehavior>
      {external ? (
        <a
          className={classNames(
            "inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-auto",
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon}
          {!hideLabel && label}
        </a>
      ) : (
        <a
          className={classNames(
            "inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-auto",
            className
          )}
        >
          {icon}
          {!hideLabel && label}
        </a>
      )}
    </Link>
  );
}

export function PrimaryButton({
  label,
  icon,
  type,
  onClick,
  className,
  disabled,
  keyboardShortcut,
}: {
  label: string | JSX.Element;
  type?: "button" | "submit" | "reset";
  onClick?: () => any;
  icon?: JSX.Element;
  disabled?: boolean;
  className?: string;
  keyboardShortcut?: string;
}) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-auto",
        className
      )}
      disabled={disabled}
      type={type || "button"}
      onClick={onClick}
    >
      {icon}
      {label}
      {keyboardShortcut && <KbdPrimary keyboardShortcut={keyboardShortcut} />}
    </button>
  );
}

export function SecondaryButton({
  label,
  className,
  type,
  disabled,
  onClick,
}: {
  label: string | JSX.Element;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick: () => any;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      type={type || "button"}
      className={classNames(
        "inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 xl:w-auto",
        className
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function SidebarButton({
  label,
  Icon,
  current = false,
  keyboardShortcut = null,
  href = null,
  onClick = null,
}: {
  label: string;
  Icon: React.FC<any>;
  current?: boolean;
  keyboardShortcut?: string;
  href?: any;
  onClick?: () => any;
}) {
  if (onClick) {
    return (
      <button
        className={classNames(
          "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200",
          "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full"
        )}
        onClick={onClick}
      >
        <Icon
          className={classNames(
            "text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
            "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
          )}
          aria-hidden="true"
        />
        <span className="truncate">{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={classNames(
        current
          ? "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200",
        "group flex items-center px-3 py-2 text-sm font-medium rounded-md"
      )}
    >
      <Icon
        className={classNames(
          current
            ? "text-gray-500 dark:text-gray-100"
            : "text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
          "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
        )}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
      {keyboardShortcut && <KbdSecondary keyboardShortcut={keyboardShortcut} />}
    </Link>
  );
}
