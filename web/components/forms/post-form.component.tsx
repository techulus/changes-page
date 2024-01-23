import { Listbox, Menu, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  CheckIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import { LightningBoltIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { useFormik } from "formik";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  IPageSettings,
  IPost,
  PostStatus,
  PostType,
  PostTypeToLabel,
} from "../../data/page.interface";
import { track } from "../../utils/analytics";
import { DateTime } from "../../utils/date";
import { useUserData } from "../../utils/useUser";
import MarkdownEditor from "../core/editor.component";
import { Spinner, SpinnerWithSpacing } from "../core/spinner.component";
import { notifyError, notifySuccess } from "../core/toast.component";
import AiExpandConceptPromptDialogComponent from "../dialogs/ai-expand-concept-prompt-dialog.component";
import AiSuggestTitlePromptDialogComponent from "../dialogs/ai-suggest-title-prompt-dialog.component";
import DateTimePromptDialog from "../dialogs/date-time-prompt-dialog.component";
import PostTypes from "../post/post-types";
import SwitchComponent from "./switch.component";
import ReactMarkdown from "react-markdown";
import { PrimaryButton } from "../core/buttons.component";
import { boolean, InferType, mixed, object, string } from "yup";
import { v4 } from "uuid";

export const NewPostSchema = object().shape({
  title: string()
    .required("Title cannot be empty")
    .min(2, "Title too Short!")
    .max(75, "Title too Long!"),
  content: string()
    .required("Content cannot be empty")
    .min(2, "Content too Short!")
    .max(9669, "Content too Long!"),
  type: mixed<PostType>()
    .oneOf(Object.values(PostType))
    .required("Enter valid type"),
  status: mixed<PostStatus>()
    .oneOf(Object.values(PostStatus))
    .required("Enter valid status"),
  page_id: string(),
  images_folder: string(),
  publish_at: string().optional().nullable(),
  allow_reactions: boolean().optional().nullable(),
  notes: string().optional().nullable(),
});

export type PostFormikForm = InferType<typeof NewPostSchema>;

export default function PostFormComponent({
  pageId,
  postId,
  post,
  pageSettings: settings,
  saving,
  loading,
  onSubmit,
}: {
  pageId: string;
  postId?: string;
  post?: IPost;
  pageSettings: IPageSettings;
  saving: boolean;
  loading?: boolean;
  onSubmit: (formik: PostFormikForm, values: any) => Promise<boolean | void>;
}) {
  const { user, billingDetails, supabase } = useUserData();
  const [promptSchedule, setPromptSchedule] = useState(false);
  const [promptTitleSuggestions, setPromptTitleSuggestions] = useState(false);
  const [promptExpandConcept, setPromptExpandConcept] = useState(false);
  //
  // For email notifications
  const [emailNotified, setEmailNotified] = useState(false);
  // Internal notes
  const [editNotes, setEditNotes] = useState(false);

  const publishingOptions = useMemo(
    () => [
      {
        name:
          settings?.email_notifications && !emailNotified
            ? "Publish & email"
            : "Publish",
        description:
          "This post will be published and can be viewed on the page.",
        value: PostStatus.published,
      },
      {
        name: "Schedule publish",
        description:
          "This post will be automatically published at a later time.",
        value: PostStatus.publish_later,
      },
      {
        name: "Save draft",
        description: "This post will be saved and can be published later.",
        value: PostStatus.draft,
      },
    ],
    [settings?.email_notifications, emailNotified]
  );

  const PostStatusToAction = useMemo(
    () => ({
      [PostStatus.published]: publishingOptions[0].name,
      [PostStatus.publish_later]: publishingOptions[1].name,
      [PostStatus.draft]: publishingOptions[2].name,
    }),
    [publishingOptions]
  );

  const formik = useFormik<InferType<typeof NewPostSchema>>({
    initialValues: {
      title: "",
      content: "",
      type: Object.keys(PostType)[0] as PostType,
      status: PostStatus.published,
      page_id: "",
      images_folder: "",
      publish_at: null,
      allow_reactions: true,
      notes: "",
    },
    validationSchema: NewPostSchema,
    onSubmit: (values) => {
      return onSubmit(formik, values);
    },
  });

  useEffect(() => {
    if (post) {
      for (let key in post) {
        formik.setFieldValue(key, post[key]);
      }
      setEmailNotified(post.email_notified ?? false);
    } else {
      formik.setFieldValue("page_id", pageId);
      formik.setFieldValue("images_folder", v4());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, pageId]);

  const onChange = useCallback(
    (value: string) => {
      formik.setFieldValue("content", value);
    },
    [formik]
  );

  // show a toast when form validation fails
  useEffect(() => {
    if (formik.errors.title && formik.touched.title) {
      notifyError(formik.errors.title);
    }

    if (formik.errors.content && formik.touched.content) {
      notifyError(formik.errors.content);
    }
  }, [formik.errors, formik.touched]);

  const suggestTitle = useCallback(() => {
    if (formik.values.content) {
      setPromptTitleSuggestions(true);
    } else {
      notifyError("Content cannot be empty");
    }
  }, [formik.values.content]);

  const expandConcept = useCallback(() => {
    if (formik.values.content) {
      setPromptExpandConcept(true);
    } else {
      notifyError("Content cannot be empty");
    }
  }, [formik.values.content]);

  if (loading) {
    return <SpinnerWithSpacing />;
  }

  return (
    <div className="relative mb-8">
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-9 relative">
          <div className="overflow-hidden md:rounded-md md:border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <Listbox
              as="div"
              value={formik.values.type}
              onChange={(type) => formik.setFieldValue("type", type)}
              className="flex-shrink-0 bg-white dark:bg-gray-800 p-2"
            >
              {({ open }) => (
                <>
                  <Listbox.Label className="sr-only">
                    {" "}
                    Add a label{" "}
                  </Listbox.Label>
                  <div className="relative">
                    <Listbox.Button className="relative p-0">
                      {PostTypes[formik.values.type ?? PostType.fix]({})}
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute left-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white dark:bg-gray-900 py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {Object.keys(PostType).map((label) => (
                          <Listbox.Option
                            key={label}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-gray-100 dark:bg-gray-700"
                                  : "bg-white dark:bg-gray-900",
                                "relative cursor-default select-none py-2 px-3 dark:text-gray-100"
                              )
                            }
                            value={label}
                          >
                            <div className="flex items-center">
                              <span className="block truncate font-medium">
                                {PostTypeToLabel[label]}
                              </span>
                            </div>
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>

            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className={classNames(
                "block w-full border-0 pt-2.5 text-2xl font-medium placeholder-gray-500 focus:ring-0 dark:bg-gray-800 dark:text-gray-50",
                formik.errors.title &&
                  formik.touched.title &&
                  "placeholder-red-600 animate-pulse animate-once"
              )}
              placeholder="# Title"
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <div
              className={classNames(
                "block w-full resize-none border-0 py-0 placeholder-gray-500 focus:ring-0 sm:text-sm border-t-2 dark:border-gray-700",
                formik.errors.title &&
                  formik.touched.title &&
                  "animate-pulse animate-once"
              )}
            >
              <MarkdownEditor
                imagesFolderPrefix={`${user?.id}/${formik.values.page_id}/${formik.values.images_folder}`}
                value={formik.values.content}
                onChange={onChange}
              />
            </div>

            {/* Spacer element to match the height of the toolbar */}
            <div aria-hidden="true">
              <div className="py-2">
                <div className="h-9" />
              </div>
              <div className="h-px" />
              <div className="py-2">
                <div className="py-px">
                  <div className="h-9" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-x-px bottom-0">
            <div className="flex flex-nowrap justify-end space-x-2 py-2 px-2 sm:px-3">
              {billingDetails?.hasActiveSubscription && (
                <Menu
                  as="div"
                  className={classNames(
                    "relative inline-block text-left ml-auto"
                  )}
                >
                  <Menu.Button className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 dark:bg-gray-900 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:dark:bg-gray-700 sm:px-3">
                    <LightningBoltIcon
                      className={classNames(
                        "text-gray-500 dark:text-gray-50",
                        "h-5 w-5 flex-shrink-0 sm:-ml-1"
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={classNames(
                        "text-gray-900 dark:text-gray-300",
                        "hidden truncate sm:ml-2 sm:block"
                      )}
                    >
                      AI Assistant
                    </span>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Menu.Items
                      style={{
                        top: -106,
                      }}
                      className="absolute right-0 z-10 mt-1 max-h-56 w-52 overflow-auto rounded-lg bg-white dark:bg-gray-900 py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <Menu.Item>
                        <button
                          type="button"
                          onClick={suggestTitle}
                          className={classNames(
                            "block w-full text-left bg-white dark:bg-gray-900 select-none py-2 px-3 dark:text-gray-100 hover:bg-gray-200 hover:dark:bg-gray-700 cursor-pointer truncate font-medium"
                          )}
                        >
                          Suggest title
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          type="button"
                          onClick={expandConcept}
                          className={classNames(
                            "block w-full text-left bg-white dark:bg-gray-900 select-none py-2 px-3 dark:text-gray-100 hover:bg-gray-200 hover:dark:bg-gray-700 cursor-pointer truncate font-medium"
                          )}
                        >
                          Expand concept
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}

              <button
                className="relative inline-flex items-center whitespace-nowrap rounded-full bg-gray-50 dark:bg-gray-900 py-2 px-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:dark:bg-gray-700 sm:px-3 cursor-pointer"
                onClick={() => setPromptSchedule(true)}
                type="button"
              >
                <CalendarIcon
                  className={classNames(
                    formik.values.publish_at === null
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-500 dark:text-gray-50",
                    "h-5 w-5 flex-shrink-0 sm:-ml-1"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={classNames(
                    formik.values.publish_at === null
                      ? ""
                      : "text-gray-900 dark:text-gray-300",
                    "hidden truncate sm:ml-2 sm:block"
                  )}
                >
                  {formik.values.publish_at
                    ? DateTime.fromISO(formik.values.publish_at).toNiceFormat()
                    : "Schedule"}
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between space-x-3 border-t border-gray-200 dark:border-gray-700 px-2 py-2 sm:px-3">
              <div className="hidden md:flex"></div>
              <div className="flex-shrink-0">
                <div className="flex flex-col md:flex-row">
                  <Listbox
                    value={formik.values.status}
                    disabled={saving}
                    onChange={(status) => {
                      if (status === PostStatus.publish_later) {
                        setPromptSchedule(true);
                      } else {
                        formik.setFieldValue("publish_at", null);
                        formik.setFieldValue("status", status);
                      }
                    }}
                  >
                    {() => (
                      <>
                        <Listbox.Label className="sr-only">
                          Change publishing status
                        </Listbox.Label>
                        <div className="relative">
                          <div className="inline-flex shadow-sm rounded-md divide-x divide-indigo-600">
                            <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-indigo-700">
                              <button
                                type="submit"
                                className="relative inline-flex items-center bg-indigo-600 py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white"
                              >
                                {saving && (
                                  <Spinner className="text-gray-200 ml-0.5" />
                                )}
                                <p className="ml-2.5 text-sm font-medium">
                                  {PostStatusToAction[formik.values.status]}
                                </p>
                              </button>
                              <Listbox.Button className="relative inline-flex items-center bg-indigo-600 p-2 rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500">
                                <span className="sr-only">
                                  Change published status
                                </span>
                                <ChevronUpIcon
                                  className="h-5 w-5 text-white"
                                  aria-hidden="true"
                                />
                              </Listbox.Button>
                            </div>
                          </div>

                          <Listbox.Options
                            style={{
                              top: -320,
                            }}
                            className="origin-top-left absolute left-0 mt-2 -mr-1 w-72 rounded-md shadow-lg overflow-hidden bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none sm:left-auto sm:right-0 border-indigo-300 dark:border-indigo-800 border-2"
                          >
                            {publishingOptions.map((option) => (
                              <Listbox.Option
                                key={option.value}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-indigo-600"
                                      : "text-gray-900 dark:text-gray-50",
                                    "cursor-pointer select-none relative p-4 text-sm"
                                  )
                                }
                                value={option.value}
                              >
                                {({ selected, active }) => (
                                  <div className="flex flex-col">
                                    <div className="flex justify-between">
                                      <p
                                        className={
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }
                                      >
                                        {option.name}
                                      </p>
                                      {selected ? (
                                        <span
                                          className={
                                            active
                                              ? "text-white"
                                              : "text-indigo-500"
                                          }
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </div>
                                    <p
                                      className={classNames(
                                        active
                                          ? "text-indigo-200"
                                          : "text-gray-500 dark:text-gray-400",
                                        "mt-2"
                                      )}
                                    >
                                      {option.description}
                                    </p>
                                  </div>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 divide-y divide-gray-200 dark:divide-gray-700">
          <div className="space-y-1 px-4 lg:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
              Settings
            </h3>
            <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              These settings are specific to this post.
            </p>
          </div>

          <div className="mt-6 shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white dark:bg-gray-900 space-y-6 sm:p-6">
              <SwitchComponent
                title="Reactions"
                message="Allow reactions on this post"
                enabled={formik.values.allow_reactions}
                onChange={(v: boolean) => {
                  formik.setFieldValue("allow_reactions", v);
                }}
              />
            </div>
          </div>

          <div className="mt-6 sm:overflow-hidden shadow sm:rounded-md border border-slate-300 dark:border-slate-600">
            <div className="relative bg-slate-50 dark:bg-slate-900">
              {!editNotes ? (
                formik.values.notes ? (
                  <ReactMarkdown className="pt-4 mx-auto px-6 prose dark:prose-invert prose-indigo max-w-full">
                    {formik.values.notes}
                  </ReactMarkdown>
                ) : null
              ) : (
                <MarkdownEditor
                  imagesFolderPrefix={`${user?.id}/${formik.values.page_id}/${formik.values.images_folder}`}
                  value={formik.values.notes}
                  onChange={(value: string) =>
                    formik.setFieldValue("notes", value)
                  }
                />
              )}

              <PrimaryButton
                className="ml-6 my-4 bg-slate-600 hover:bg-slate-700 focus:ring-slate-500"
                label={editNotes ? "Save" : "Edit Internal Notes"}
                onClick={async () => {
                  setEditNotes(!editNotes);

                  if (editNotes) {
                    if (postId) {
                      await supabase
                        .from("posts")
                        .update({
                          notes: formik.values.notes ?? "",
                        })
                        .match({ id: postId })
                        .then(() => {
                          notifySuccess("Notes saved");
                        });
                    }
                  } else {
                    if (window.scrollTo) {
                      setTimeout(() => {
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        });
                      });
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </form>

      <DateTimePromptDialog
        label="Schedule post"
        open={promptSchedule}
        setOpen={setPromptSchedule}
        initialValue={formik.values.publish_at}
        confirmCallback={(publish_at: string) => {
          if (new Date(publish_at) < new Date()) {
            formik.setFieldValue("publish_at", null);
            formik.setFieldValue("status", PostStatus.published);
          } else {
            formik.setFieldValue("publish_at", publish_at);
            formik.setFieldValue("status", PostStatus.publish_later);
          }

          setPromptSchedule(false);
          track("SchedulePost");
        }}
      />

      <AiSuggestTitlePromptDialogComponent
        content={formik.values.content}
        open={promptTitleSuggestions}
        setOpen={setPromptTitleSuggestions}
        confirmCallback={(title: string) => {
          formik.setFieldValue("title", title);
          setPromptTitleSuggestions(false);
          track("AiSuggestTitle");
        }}
      />

      <AiExpandConceptPromptDialogComponent
        content={formik.values.content}
        open={promptExpandConcept}
        setOpen={(open: boolean) => {
          setPromptExpandConcept(open);
          track("AiExpandConcept");
        }}
        insertContentCallback={(content: string) => {
          setPromptExpandConcept(false);
          track("AiExpandConceptCopyToPost");
          formik.setFieldValue(
            "content",
            `${formik.values.content}\n\n${content}`
          );
        }}
      />
    </div>
  );
}
