import { InformationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";

export function InfoMessage({
  message,
  className,
}: {
  message: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "rounded-md bg-indigo-50 dark:bg-indigo-900 p-4",
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-indigo-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <div className="text-sm text-indigo-700 dark:text-indigo-200">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700 dark:text-red-200">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function InlineErrorMessage({ message }) {
  return (
    <div className="rounded-md bg-red-50 dark:bg-red-900 p-2">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700 dark:text-red-200">{message}</p>
        </div>
      </div>
    </div>
  );
}
