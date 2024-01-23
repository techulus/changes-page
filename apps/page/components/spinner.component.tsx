import classnames from "classnames";

export function Spinner({ className = "" }) {
  return (
    <svg
      className={classnames(
        "animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900 dark:text-gray-100",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export function SpinnerWithSpacing() {
  return (
    <li className="relative pl-4 pr-6 py-5 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6 flex items-center justify-center h-48">
      <Spinner />
    </li>
  );
}
