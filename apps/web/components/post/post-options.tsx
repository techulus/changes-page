import { PostStatus } from "@changespage/supabase/types/page";
import { Menu, Transition } from "@headlessui/react";
import { LocationMarkerIcon as RemovePinIcon } from "@heroicons/react/outline";
import {
  LocationMarkerIcon as AddPinIcon,
  ExternalLinkIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import { Fragment } from "react";
import { ROUTES } from "../../data/routes.data";
import { MenuItem } from "../core/menu.component";

const PostOptions = ({
  post,
  postUrl,
  settings,
  updatePageSettings,
  page_id,
  setDeletePost,
  setOpenDeletePost,
  floating = false,
}) => (
  <Transition
    // @ts-ignore
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    <Menu.Items
      className={classNames(
        "z-50 origin-top-right absolute right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 border-indigo-300 dark:border-indigo-800 border-2",
        floating && "left-0"
      )}
    >
      <div className="py-1">
        {post.status === PostStatus.published && (
          <MenuItem
            label="View Post"
            icon={
              <ExternalLinkIcon
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
            }
            route={postUrl}
            external
          />
        )}

        {post.status === PostStatus.published &&
          (settings.pinned_post_id !== post.id ? (
            <MenuItem
              label="Pin Post"
              icon={
                <AddPinIcon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              }
              onClick={() =>
                updatePageSettings({
                  pinned_post_id: post.id,
                })
              }
            />
          ) : (
            <MenuItem
              label="Remove Pin"
              icon={
                <RemovePinIcon
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              }
              onClick={() =>
                updatePageSettings({
                  pinned_post_id: null,
                })
              }
            />
          ))}
        <MenuItem
          label="Edit Post"
          icon={
            <PencilAltIcon
              className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          }
          route={`${ROUTES.PAGES}/${page_id}/${post.id}`}
        />
      </div>
      <div className="py-1">
        <MenuItem
          label="Delete Post"
          icon={
            <TrashIcon
              className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
              aria-hidden="true"
            />
          }
          onClick={() => {
            setDeletePost(post);
            setOpenDeletePost(true);
          }}
        />
      </div>
    </Menu.Items>
  </Transition>
);

export default PostOptions;
