/* This example requires Tailwind CSS v2.0+ */
import { Spinner } from "@changes-page/ui";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import Head from "next/head";
import { Fragment, useRef, useState } from "react";

export default function ConfirmDeleteDialog({
  itemName,
  open,
  setOpen,
  highRiskAction = false,
  riskVerificationText = "",
  deleteCallback = () => null,
  processing = false,
}) {
  const [confirm, setConfirm] = useState("");
  const cancelButtonRef = useRef(null);

  return (
    <>
      {open && (
        <Head>
          <meta name="theme-color" content="#dc2626" />
        </Head>
      )}
      {/* @ts-ignore */}
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
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50"
                      >
                        Are you sure you want to delete &quot;{itemName}&quot;?
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          It will be permanently removed and this action cannot
                          be undone.
                        </p>
                      </div>

                      {highRiskAction && (
                        <div className="mt-3">
                          <div className="flex justify-between">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                              Enter{" "}
                              <span className="font-semibold">
                                {riskVerificationText}
                              </span>{" "}
                              below to confirm
                            </label>
                          </div>
                          <div className="mt-1">
                            <input
                              type="text"
                              autoCapitalize="off"
                              autoComplete="false"
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:text-gray-100 dark:bg-gray-800"
                              placeholder={riskVerificationText}
                              value={confirm}
                              onChange={(evt) => setConfirm(evt.target.value)}
                              aria-describedby="confirm-delete"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className={classNames(
                      "w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm",
                      highRiskAction &&
                        confirm !== riskVerificationText &&
                        "cursor-not-allowed"
                    )}
                    disabled={
                      processing ||
                      (highRiskAction && confirm !== riskVerificationText)
                    }
                    onClick={deleteCallback}
                  >
                    {processing ? <Spinner message="Deleting" /> : "Delete"}
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
    </>
  );
}
