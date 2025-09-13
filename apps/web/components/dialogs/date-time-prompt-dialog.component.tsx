import { DateTime } from "@changes-page/utils";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { ClockIcon } from "@heroicons/react/solid";
import * as chrono from "chrono-node";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

export default function DateTimePromptDialog({
  label,
  description,
  open,
  setOpen,
  initialValue = null,
  confirmCallback,
  disablePastDate = false,
}) {
  const cancelButtonRef = useRef(null);

  const [naturalDateString, setNaturalDateString] = useState("");

  const [value, setValue] = useState(initialValue ?? null);
  const disabled = useMemo(
    () => disablePastDate && new Date(value) < new Date(),
    [value, disablePastDate]
  );

  const [naturalDateInput] = useDebounce(naturalDateString, 500);

  useEffect(() => {
    if (naturalDateInput) {
      const result = chrono.parseDate(naturalDateInput);
      setValue(result);
    }
  }, [naturalDateInput]);

  useEffect(() => {
    if (open) {
      setNaturalDateString("");
      setValue(null);
    }
  }, [open]);

  return (
    // @ts-ignore
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            // @ts-ignore
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-20 backdrop-blur transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            // @ts-ignore
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50"
                    >
                      {label}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>

                    <div className="mt-3">
                      <div className="mt-1">
                        <input
                          type="text"
                          autoComplete="off"
                          name="natural_date_string"
                          id="natural_date_string"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:text-gray-100 dark:bg-gray-800"
                          onChange={(evt) => {
                            setNaturalDateString(evt?.target?.value);
                          }}
                          value={naturalDateString}
                          placeholder={
                            'Write time here, eg: "tomorrow at 10am" or "in 2 hours"'
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-600"
                  disabled={disabled || !value}
                  onClick={() => confirmCallback(new Date(value).toISOString())}
                >
                  <ClockIcon className="inline w-5 h-5 mr-2" />
                  Confirm{" "}
                  {value ? DateTime.fromJSDate(value).toNiceFormat() : ""}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
