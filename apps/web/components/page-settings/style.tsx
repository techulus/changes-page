import { Database } from "@changespage/supabase/types";
import { IPage, IPageSettings } from "@changespage/supabase/types/page";
import { Spinner } from "@changespage/ui";
import fileExtension from "file-extension";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useFilePicker } from "use-file-picker";
import { v4 } from "uuid";
import usePrefersColorScheme from "../../utils/hooks/usePrefersColorScheme";
import useStorage from "../../utils/useStorage";
import { useUserData } from "../../utils/useUser";
import { PrimaryButton, SecondaryButton } from "../core/buttons.component";
import { notifyError } from "../core/toast.component";
import SwitchComponent from "../forms/switch.component";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function StyleSettings({
  pageId,
  page,
  settings,
  updatePageSettings,
}: {
  pageId: string;
  page: Pick<IPage, "url_slug">;
  settings: IPageSettings;
  updatePageSettings: (values) => any;
}) {
  const { user } = useUserData();
  const { uploadFile, deleteFileFromUrl } = useStorage();
  const appearance = usePrefersColorScheme();

  const [uploadingLogo, setUploadingLogoLoading] = useState(false);
  const [deletingPageLogo, setDeletingPageLogo] = useState(false);
  const [uploadingCover, setUploadingCoverLoading] = useState(false);
  const [deletingPageCover, setDeletingPageCover] = useState(false);

  const [whitelabel, setWhiteLabel] = useState(settings?.whitelabel);
  const [hideSearchEngine, setHideSearchEngine] = useState(
    settings?.hide_search_engine
  );

  const [colorScheme, setColorScheme] = useState(settings?.color_scheme);
  const [customCss, setCustomCss] = useState(
    settings?.custom_css ?? "/* Enter custom CSS here */"
  );
  const [debouncedCustomCss] = useDebounce(customCss, 1000);

  useEffect(() => {
    if (settings?.custom_css !== debouncedCustomCss) {
      updatePageSettings({
        custom_css: debouncedCustomCss,
      });
    }
  }, [debouncedCustomCss, settings?.custom_css]);

  const [
    openLogoFileSelector,
    {
      filesContent: logoFiles,
      loading: loadingLogoFile,
      errors: logoFileErrors,
      clear: clearLogoFiles,
    },
  ] = useFilePicker({
    readAs: "ArrayBuffer",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 2,
    imageSizeRestrictions: {
      minHeight: 300,
      minWidth: 300,
    },
  });

  const [
    openCoverFileSelector,
    {
      filesContent: coverFiles,
      loading: loadingCoverFile,
      errors: coverFileErrors,
      clear: clearCoverFiles,
    },
  ] = useFilePicker({
    readAs: "ArrayBuffer",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 10,
  });

  async function uploadPageLogo(file) {
    setUploadingLogoLoading(true);
    const fileKey = `${user?.id}/${pageId}/${v4()}.${fileExtension(file.name)}`;

    if (settings?.page_logo) {
      await deleteFileFromUrl(settings?.page_logo);
    }

    const url = await uploadFile(fileKey, file.content);

    await updatePageSettings({
      page_logo: url,
    });

    clearLogoFiles();
    setUploadingLogoLoading(false);
  }

  async function deletePageLogo() {
    setDeletingPageLogo(true);

    if (settings?.page_logo) {
      await deleteFileFromUrl(settings?.page_logo);
    }

    await updatePageSettings({
      page_logo: null,
    });
    setDeletingPageLogo(false);
  }

  async function uploadPageCover(file) {
    setUploadingCoverLoading(true);
    const fileKey = `${user?.id}/${pageId}/${v4()}.${fileExtension(file.name)}`;

    if (settings?.cover_image) {
      await deleteFileFromUrl(settings?.cover_image);
    }

    const url = await uploadFile(fileKey, file.content);

    await updatePageSettings({
      cover_image: url,
    });

    clearCoverFiles();
    setUploadingCoverLoading(false);
  }

  async function deletePageCover() {
    setDeletingPageCover(true);

    if (settings?.cover_image) {
      await deleteFileFromUrl(settings?.cover_image);
    }

    await updatePageSettings({
      cover_image: null,
    });

    setDeletingPageCover(false);
  }

  useEffect(() => {
    if (logoFileErrors.length) {
      notifyError(logoFileErrors[0].name);
    }

    if (coverFileErrors.length) {
      notifyError(coverFileErrors[0].name);
    }
  }, [logoFileErrors, coverFileErrors]);

  useEffect(() => {
    if (logoFiles.length) {
      uploadPageLogo(logoFiles[0]);
    }

    if (coverFiles.length) {
      uploadPageCover(coverFiles[0]);
    }
  }, [logoFiles, coverFiles]);

  return (
    <>
      <div className="mt-4 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Appearance
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Customize look and feel of the page.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
                    Page Logo
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    The page logo should be transparent and at least 300x300px
                  </p>

                  <div className="mt-1 flex items-center">
                    <span className="inline-block overflow-hidden bg-gray-100 dark:bg-gray-600 rounded-full">
                      {settings?.page_logo ? (
                        <Image
                          width={56}
                          height={56}
                          className="h-14 w-14"
                          src={settings?.page_logo}
                          alt="page logo"
                        />
                      ) : (
                        <svg
                          className="h-12 w-12 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>

                    <PrimaryButton
                      label={
                        loadingLogoFile || uploadingLogo ? (
                          <Spinner message="Uploading" />
                        ) : (
                          "Upload"
                        )
                      }
                      disabled={loadingLogoFile || uploadingLogo}
                      onClick={openLogoFileSelector}
                      className="ml-3"
                    />

                    {settings?.page_logo && (
                      <SecondaryButton
                        label={
                          deletingPageLogo ? (
                            <Spinner message="Removing" />
                          ) : (
                            "Remove"
                          )
                        }
                        disabled={deletingPageLogo}
                        onClick={deletePageLogo}
                        className="ml-3"
                      />
                    )}
                  </div>
                </div>

                <div className="sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm:pt-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
                    Cover image
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    An optional large background image for your site.
                  </p>

                  {settings?.cover_image ? (
                    <img
                      className="mt-1"
                      src={settings?.cover_image}
                      alt="cover image"
                    />
                  ) : (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex mt-2 text-gray-600 dark:text-gray-400">
                    <PrimaryButton
                      label={
                        loadingCoverFile || uploadingCover ? (
                          <Spinner message="Uploading" />
                        ) : (
                          "Upload"
                        )
                      }
                      disabled={loadingCoverFile || uploadingCover}
                      onClick={openCoverFileSelector}
                    />

                    {settings?.cover_image && (
                      <SecondaryButton
                        label={
                          deletingPageCover ? (
                            <Spinner message="Removing" />
                          ) : (
                            "Remove"
                          )
                        }
                        disabled={deletingPageCover}
                        onClick={deletePageCover}
                        className="ml-3"
                      />
                    )}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm:pt-5">
                  <label
                    htmlFor="color_scheme"
                    className="block text-sm font-semibold leading-6  text-gray-900 dark:text-gray-50 sm:pt-1.5"
                  >
                    Color scheme
                  </label>
                  <div className="mt-2 sm:col-span-2 sm:mt-0">
                    <select
                      id="color_scheme"
                      name="color_scheme"
                      className="block w-full max-w-lg rounded-md border-0 py-1.5 border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      value={colorScheme}
                      onChange={async (evt) => {
                        const value = (evt?.target?.value ||
                          "auto") as Database["public"]["Enums"]["page_color_scheme"];

                        setColorScheme(value);

                        await updatePageSettings({
                          color_scheme: value,
                        });
                      }}
                    >
                      <option value="auto">Auto</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

                <div className="sm:border-t sm:border-gray-200 dark:sm:border-gray-700 sm:pt-5">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
                    Custom CSS
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Add custom CSS to customize the page look and feel.
                  </p>
                  <Editor
                    height="30vh"
                    defaultLanguage="css"
                    defaultValue={customCss}
                    theme={appearance === "dark" ? "vs-dark" : "light"}
                    onChange={(value) => {
                      setCustomCss(value ?? "");
                    }}
                    options={{
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>

              {page && (
                <div className="px-4 py-3 bg-gray-50 dark:bg-black text-right sm:px-6">
                  <a
                    href={`https://${page?.url_slug}.changes.page`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View page
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200 dark:border-gray-800" />
        </div>
      </div>

      <div className="mt-10 mb-4 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                Privacy
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Control who can see your public page.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                <SwitchComponent
                  title="Hide from search engines"
                  message="Your public page will stop being visible to search engines. Only people with the direct link will be able to access it."
                  enabled={hideSearchEngine}
                  setEnabled={setHideSearchEngine}
                  onChange={async (val) =>
                    await updatePageSettings({ hide_search_engine: val })
                  }
                />

                <SwitchComponent
                  title="Whitelabel"
                  message="Hide all changes.page branding your public page."
                  enabled={whitelabel}
                  setEnabled={setWhiteLabel}
                  onChange={async (val) =>
                    await updatePageSettings({ whitelabel: val })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
