import {
  IRoadmapBoard,
  IRoadmapCategory,
} from "@changespage/supabase/types/page";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useCallback } from "react";
import MarkdownEditor from "../core/editor.component";
import { FormErrors, ItemForm, RoadmapItemWithRelations } from "./types";

interface RoadmapItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  itemForm: ItemForm;
  setItemForm: React.Dispatch<React.SetStateAction<ItemForm>>;
  formErrors: FormErrors;
  isSubmitting: boolean;
  editingItem: RoadmapItemWithRelations | null;
  categories: IRoadmapCategory[];
  board: IRoadmapBoard;
}

export default function RoadmapItemModal({
  isOpen,
  onClose,
  onSubmit,
  itemForm,
  setItemForm,
  formErrors,
  isSubmitting,
  editingItem,
  categories,
  board,
}: RoadmapItemModalProps) {
  const handleDescriptionChange = useCallback(
    (value: string) => {
      setItemForm((prev) => ({
        ...prev,
        description: value,
      }));
    },
    [setItemForm]
  );

  return (
    // @ts-ignore
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-0 text-center sm:items-center sm:p-4">
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
              <div className="relative w-full sm:w-auto">
                {/* Desktop Close Button */}
                <button
                  type="button"
                  className="hidden sm:block absolute -top-4 -right-4 z-30 rounded-full bg-white dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg border border-gray-200 dark:border-gray-600"
                  onClick={onClose}
                >
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                <Dialog.Panel className="w-full h-full sm:h-auto sm:max-w-5xl sm:min-w-[880px] transform overflow-hidden rounded-none sm:rounded-2xl bg-white dark:bg-gray-900 text-left align-middle shadow-xl transition-all flex flex-col sm:block">
                  {/* Mobile Header with Close Button */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sm:hidden">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {editingItem ? "Edit Item" : "Create Item"}
                    </h3>
                    <button
                      type="button"
                      className="rounded-full p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={onClose}
                    >
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="p-4 sm:p-8 overflow-y-auto flex-1 sm:h-auto">
                    <form onSubmit={onSubmit} className="h-full">
                      {formErrors.general && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                          <div className="text-sm text-red-700 dark:text-red-400">
                            {formErrors.general}
                          </div>
                        </div>
                      )}

                      {formErrors.title && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 mb-4">
                          <div className="text-sm text-red-700 dark:text-red-400">
                            {formErrors.title}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative h-full">
                        {/* Column Divider */}
                        <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 transform -translate-x-1/2 z-10"></div>

                        {/* Left side - Content */}
                        <div className="lg:col-span-2 space-y-6">
                          <h3 className="hidden sm:block text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                            {editingItem ? "Edit Item" : "Create Item"}
                          </h3>
                          <div>
                            <input
                              type="text"
                              value={itemForm.title}
                              onChange={(e) =>
                                setItemForm((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              className="w-full text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none mb-6"
                              placeholder="Enter item title..."
                            />
                            <MarkdownEditor
                              value={itemForm.description}
                              onChange={handleDescriptionChange}
                              imagesFolderPrefix={null}
                            />
                          </div>
                        </div>

                        {/* Right side - Metadata */}
                        <div className="lg:col-span-1 space-y-6">
                          {categories.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Category
                              </span>
                              <select
                                value={itemForm.category_id}
                                onChange={(e) =>
                                  setItemForm((prev) => ({
                                    ...prev,
                                    category_id: e.target.value,
                                  }))
                                }
                                className="text-sm rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300"
                              >
                                <option value="">No category</option>
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Board
                            </span>
                            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                              {board.title}
                            </span>
                          </div>

                          <div className="space-y-3 pt-4">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting
                                ? "Saving..."
                                : editingItem
                                ? "Update Item"
                                : "Create Item"}
                            </button>
                            <button
                              type="button"
                              onClick={onClose}
                              className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
