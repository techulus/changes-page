import { Transition } from "@headlessui/react";
import classNames from "classnames";
import { useCallback, useEffect, useState } from "react";
import { httpGet, httpPost } from "../utils/http";

export type IReactions = {
  thumbs_up?: number;
  thumbs_down?: number;
  rocket?: number;
  sad?: number;
  heart?: number;
};

const ReactionsCounter = ({
  postId,
  aggregate,
  user,
  floating,
  optimisticUpdate,
  setShowPicker,
}: {
  postId: string;
  aggregate: IReactions;
  user: IReactions;
  floating: boolean;
  optimisticUpdate?: (reaction: string, status: boolean) => void;
  setShowPicker?: (v: boolean) => void;
}) => {
  const doReact = useCallback(
    (reaction: string) => {
      if (setShowPicker) {
        setShowPicker(false);
      }

      if (optimisticUpdate) {
        // @ts-ignore
        optimisticUpdate(reaction, !user[reaction]);
      }

      void httpPost({
        url: "/api/post/react",
        data: {
          reaction,
          post_id: postId,
        },
      });
    },
    [postId, setShowPicker, user, optimisticUpdate]
  );

  return (
    <div
      className={classNames(
        "flex items-center space-x-1 p-1",
        floating
          ? "shadow-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
          : "ml-2"
      )}
    >
      {floating || (!floating && aggregate?.thumbs_up) ? (
        <button
          className={classNames(
            "flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md",
            user?.thumbs_up
              ? "bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              : ""
          )}
          onClick={() => doReact("thumbs_up")}
        >
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          {!floating && aggregate?.thumbs_up ? (
            <span>{aggregate?.thumbs_up}</span>
          ) : null}
        </button>
      ) : null}

      {floating || (!floating && aggregate?.thumbs_down) ? (
        <button
          className={classNames(
            "flex items-center space-x-1 text-sm text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md",
            user?.thumbs_down
              ? "bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              : ""
          )}
          onClick={() => doReact("thumbs_down")}
        >
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
          </svg>
          {!floating && aggregate?.thumbs_down ? (
            <span>{aggregate?.thumbs_down}</span>
          ) : null}
        </button>
      ) : null}

      {floating || (!floating && aggregate?.rocket) ? (
        <button
          className={classNames(
            "flex items-center space-x-1 text-sm text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md",
            user?.rocket
              ? "bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              : ""
          )}
          onClick={() => doReact("rocket")}
        >
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
          {!floating && aggregate?.rocket ? (
            <span>{aggregate?.rocket}</span>
          ) : null}
        </button>
      ) : null}

      {floating || (!floating && aggregate?.sad) ? (
        <button
          className={classNames(
            "flex items-center space-x-1 text-sm text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md",
            user?.sad
              ? "bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              : ""
          )}
          onClick={() => doReact("sad")}
        >
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
          {!floating && aggregate?.sad ? <span>{aggregate?.sad}</span> : null}
        </button>
      ) : null}

      {floating || (!floating && aggregate?.heart) ? (
        <button
          className={classNames(
            "flex items-center space-x-1 text-sm text-pink-500 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-200 hover:bg-gray-100 dark:hover:bg-gray-900 p-2 rounded-md",
            user?.heart
              ? "bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              : ""
          )}
          onClick={() => doReact("heart")}
        >
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          {!floating && aggregate?.heart ? (
            <span>{aggregate?.heart}</span>
          ) : null}
        </button>
      ) : null}
    </div>
  );
};

export default function Reactions(props: any) {
  const { post } = props;
  const [showPicker, setShowPicker] = useState(false);
  const [reactions, setReactions] = useState<IReactions>({});
  const [userReaction, setUserReaction] = useState<IReactions>({});

  const optimisticUpdate = useCallback(
    (reaction: string, status: boolean) => {
      setReactions((prev) => {
        const newReactions: IReactions = { ...prev };
        // @ts-ignore
        newReactions[reaction] =
          // @ts-ignore
          (newReactions[reaction] ?? 0) + (status ? 1 : -1);
        return newReactions;
      });
      setUserReaction((prev) => {
        const newUserReaction: IReactions = { ...prev };
        // @ts-ignore
        newUserReaction[reaction] = status ? 1 : 0;
        return newUserReaction;
      });
    },
    [setReactions, setUserReaction]
  );

  const updateReactions = useCallback(() => {
    if (!post || !post?.id) return;

    httpGet({ url: `/api/post/reactions?post_id=${post.id}` }).then((data) => {
      setReactions(data?.aggregate ?? {});

      if (data.user) {
        const { user } = data;
        setUserReaction({
          thumbs_up: user.thumbs_up ? 1 : 0,
          thumbs_down: user.thumbs_down ? 1 : 0,
          heart: user.heart ? 1 : 0,
          rocket: user.rocket ? 1 : 0,
          sad: user.sad ? 1 : 0,
        });
      }
    });
  }, [post]);

  useEffect(() => {
    updateReactions();
  }, [updateReactions]);

  return (
    <div className="flex">
      <div className="relative flex items-center">
        <button
          className="text-sm p-1.5 my-2 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
          onClick={() => setShowPicker((v) => !v)}
        >
          <svg
            className=" w-4 h-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
          </svg>
        </button>

        <Transition
          show={showPicker}
          as="div"
          className="absolute left-10 bottom-0.5"
          enter="transform ease-out duration-300 transition"
          enterFrom="-translate-x-2 opacity-0"
          enterTo="translate-x-0 opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 -translate-x-2"
        >
          <ReactionsCounter
            postId={post.id}
            aggregate={reactions}
            user={userReaction}
            optimisticUpdate={optimisticUpdate}
            setShowPicker={setShowPicker}
            floating
          />
        </Transition>
      </div>

      {Object.values(reactions).some((v) => Number(v) > 0) ? (
        <ReactionsCounter
          postId={post.id}
          aggregate={reactions}
          user={userReaction}
          optimisticUpdate={optimisticUpdate}
          setShowPicker={setShowPicker}
          floating={false}
        />
      ) : null}
    </div>
  );
}
