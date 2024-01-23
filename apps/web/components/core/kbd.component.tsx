import classNames from "classnames";

export const KbdPrimary = ({
  keyboardShortcut,
}: {
  keyboardShortcut: string;
}) => (
  <kbd
    className={classNames(
      "ml-2 hidden md:flex h-5 w-5 items-center justify-center rounded border bg-white font-semibold border-indigo-600 text-indigo-600 uppercase"
    )}
  >
    {keyboardShortcut}
  </kbd>
);

export const KbdSecondary = ({
  keyboardShortcut,
}: {
  keyboardShortcut: string;
}) => (
  <kbd
    className={classNames(
      "ml-auto hidden md:flex h-5 w-auto px-1 items-center justify-center rounded border bg-white font-semibold border-gray-400 dark:border-gray-600 text-gray-400 dark:text-gray-500 dark:bg-gray-900"
    )}
  >
    {keyboardShortcut}
  </kbd>
);
