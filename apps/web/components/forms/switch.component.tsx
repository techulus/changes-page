import { Switch } from "@headlessui/react";
import classNames from "classnames";

export default function SwitchComponent({
  title,
  message,
  enabled,
  setEnabled,
  onChange,
}: {
  title: string;
  message: string;
  enabled: boolean;
  setEnabled?: (value: boolean) => void;
  onChange: (value: boolean) => void;
}) {
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex-grow flex flex-col">
        <Switch.Label
          as="span"
          className="text-sm font-semibold text-gray-900 dark:text-gray-50"
          passive
        >
          {title}
        </Switch.Label>
        <Switch.Description
          as="span"
          className="text-sm text-gray-500 dark:text-gray-400 mr-2"
        >
          {message}
        </Switch.Description>
      </span>
      <Switch
        checked={enabled}
        onChange={(value) => {
          if (setEnabled) {
            setEnabled(value);
          }
          onChange(value);
        }}
        className={classNames(
          enabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-600",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? "translate-x-5" : "translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
