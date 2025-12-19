import { IPost } from "@changespage/supabase/types/page";
import { Transition } from "@headlessui/react";
import { SpeakerphoneIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

type IPostWithUrl = IPost & { url: string };

export default function Changelog() {
  const router = useRouter();
  const [latestPost, setLatestPost] = useState<IPostWithUrl>(null);

  useEffect(() => {
    if (router.pathname === "/pages") {
      fetch("https://hey.changes.page/latest.json", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Cache: "no-cache",
        }),
      })
        .then(async (res) => {
          const post = await res.json();

          if (post && window?.localStorage?.getItem("cp_lp_id") !== post.id) {
            setLatestPost(post);
          }
        })
        .catch((e) => {
          console.error("Changelog error: Failed to fetch latest post", e);
        });
    }
  }, [router.pathname]);

  const dismiss = () => {
    window?.localStorage?.setItem("cp_lp_id", latestPost.id);
    setLatestPost(null);
  };

  if (!latestPost) return null;

  return (
    <>
      <Transition
        show
        // @ts-ignore
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pointer-events-auto overflow-hidden md:rounded-lg shadow bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 border-indigo-500 border mb-6">
          <div className="p-2">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <SpeakerphoneIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {latestPost?.title}
                </p>
                <div className="mt-3 flex space-x-7">
                  <button
                    type="button"
                    className="rounded-md text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      dismiss();
                      window.open(latestPost?.url, "_blank");
                    }}
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}
