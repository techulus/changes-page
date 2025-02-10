import { ITeam } from "@changes-page/supabase/types/page";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef } from "react";
import { InferType } from "yup";
import { ROUTES } from "../../data/routes.data";
import { NewTeamSchema } from "../../data/schema";
import { track } from "../../utils/analytics";
import { useUserData } from "../../utils/useUser";
import { InlineErrorMessage } from "../forms/notification.component";

export default function ManageTeamDialog({
  open,
  setOpen,
  team,
  onSuccess,
  onCancel,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  team?: ITeam;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const cancelButtonRef = useRef(null);
  const { supabase, user } = useUserData();

  useEffect(() => {
    if (open) {
      formik.resetForm();
    }

    if (team) {
      formik.setValues({
        name: team.name,
        image: team.image,
      });
    }
  }, [open, team]);

  const formik = useFormik<InferType<typeof NewTeamSchema>>({
    initialValues: {
      name: "",
      image: null,
    },
    validationSchema: NewTeamSchema,
    onSubmit: async (values) => {
      if (!user) {
        router.push(ROUTES.LOGIN);
        return;
      }

      if (!values.name) {
        formik.setFieldError("name", "Name is required");
        return;
      }

      if (team) {
        await supabase
          .from("teams")
          .update({
            name: values.name,
            image: values.image,
          })
          .match({ id: team.id });
        track("EditTeam");
        onSuccess();
      } else {
        await supabase
          .from("teams")
          .insert([
            {
              name: values.name,
              image: values.image,
              owner_id: user.id,
            },
          ])
          .select();
        track("CreateTeam");
        onSuccess();
      }

      setOpen(false);
    },
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusIcon
                      className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50"
                    >
                      {team ? "Edit Team" : "Create Team"}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {team
                          ? "Edit your team details."
                          : "Create a new team to manage your pages and posts."}
                      </p>
                    </div>

                    <div className="mt-3">
                      <form
                        className="space-y-8"
                        onSubmit={formik.handleSubmit}
                      >
                        <div className="mt-2 sm:mt-2 space-y-6 sm:space-y-5">
                          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2">
                              Name
                            </label>

                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                                placeholder="My Team"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                              />

                              {formik.errors.name && formik.touched.name && (
                                <div className="mt-2">
                                  <InlineErrorMessage
                                    message={formik.errors.name}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mt-px sm:pt-2">
                              Image URL
                            </label>

                            <div className="mt-1 sm:col-span-2 sm:mt-0">
                              <input
                                type="url"
                                name="image"
                                id="image"
                                className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                                placeholder="https://example.com/image.png"
                                value={formik.values.image || ""}
                                onChange={formik.handleChange}
                              />

                              {formik.errors.image && formik.touched.image && (
                                <div className="mt-2">
                                  <InlineErrorMessage
                                    message={formik.errors.image}
                                  />
                                </div>
                              )}

                              {formik.values.image && !formik.errors.image && (
                                <div className="mt-2">
                                  <img
                                    src={formik.values.image}
                                    alt="Team Avatar Preview"
                                    className="h-20 w-20 rounded-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      formik.setFieldError(
                                        "image",
                                        "Failed to load image"
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-600"
                  disabled={formik.isSubmitting}
                  onClick={() => {
                    formik.submitForm();
                  }}
                >
                  {formik.isSubmitting ? "Saving..." : "Confirm"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setOpen(false);
                    onCancel();
                  }}
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
