import { useCompletion } from "@ai-sdk/react";
import { SpinnerWithSpacing } from "@changes-page/ui";
import { Dialog, Transition } from "@headlessui/react";
import { LightningBoltIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import { notifyError } from "../core/toast.component";

export default function AiProofReadDialogComponent({
  open,
  setOpen,
  content,
  onReplace,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  content: string;
  onReplace?: (content: string) => void;
}) {
  const cancelButtonRef = useRef(null);

  const { completion, complete, isLoading, setCompletion } = useCompletion({
    api: "/api/ai/proof-read",
    streamProtocol: "text",
    onError: () => {
      setOpen(false);
      notifyError("Failed to process request, please contact support.");
    },
  });

  useEffect(() => {
    if (open && content) {
      setCompletion("");
      complete(content);
    }
  }, [open, content]);

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
            <div className="inline-block align-bottom bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full mx-4 sm:mx-0 sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50"
                    >
                      <LightningBoltIcon
                        className="h-6 w-6 text-indigo-600 inline-flex mr-2"
                        aria-hidden="true"
                      />

                      {isLoading && !completion
                        ? "Loading..."
                        : isLoading
                          ? "Proofreading..."
                          : "Here is the proofread result!"}
                    </Dialog.Title>

                    <div className="mt-5 w-full">
                      <div className="mt-1 space-y-1">
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="rounded-md border border-gray-200 dark:border-gray-600 dark:divide-gray-600 p-4 max-h-[60vh] overflow-y-auto">
                            {isLoading && !completion && <SpinnerWithSpacing />}

                            <div className="text-black dark:text-white prose dark:prose-invert prose-sm max-w-none">
                              <Streamdown>{completion}</Streamdown>
                            </div>
                          </div>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {onReplace && (
                  <button
                    type="button"
                    disabled={isLoading || !completion}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      onReplace(completion);
                      setOpen(false);
                    }}
                  >
                    Replace Content
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
