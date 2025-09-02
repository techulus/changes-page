import { IPage, IPageSettings } from "@changes-page/supabase/types/page";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import OptionalLink from "./optional-link";

type RoadmapBoard = {
  id: string;
  title: string;
  slug: string;
  description?: string;
};

export default function PageHeader({
  page,
  settings,
  roadmaps = [],
}: {
  page: IPage;
  settings: IPageSettings;
  roadmaps?: RoadmapBoard[];
}) {
  const router = useRouter();
  const currentPath = router.asPath;
  const isRoadmapPage = currentPath.includes("/roadmap/");

  return (
    <>
      {settings?.custom_css ? (
        <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />
      ) : null}

      {settings?.cover_image && (
        <div className="relative h-32 md:h-64 w-screen cp__page-cover">
          <Image
            fill
            placeholder="blur"
            blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            alt={page?.title}
            src={settings?.cover_image}
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <div
        className={classNames(
          "relative mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8",
          settings?.cover_image && settings?.page_logo && "-mt-24 z-50"
        )}
      >
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-4">
              {settings?.page_logo && (
                <OptionalLink href={settings?.product_url}>
                  <Image
                    placeholder="blur"
                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    className="h-12 w-12 md:h-16 md:w-16 bg-gray-100 dark:bg-gray-900 rounded-full p-2 cp__page-logo"
                    alt={page?.title}
                    src={settings?.page_logo}
                    width={64}
                    height={64}
                  />
                </OptionalLink>
              )}
              <div>
                <OptionalLink href={settings?.product_url}>
                  <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl cp__page-title">
                    {page?.title}
                  </h1>
                </OptionalLink>
              </div>
            </div>

            {page?.description && (
              <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 cp__page-description">
                {page?.description}
              </p>
            )}

            {/* Navigation bar - only show if there are roadmaps */}
            {roadmaps.length > 0 && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <Link
                    href="/"
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      !isRoadmapPage
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    Changelog
                  </Link>

                  {roadmaps.length === 1 ? (
                    <Link
                      href={`/roadmap/${roadmaps[0].slug}`}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        isRoadmapPage
                          ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      Roadmap
                    </Link>
                  ) : (
                    <Menu as="div" className="relative">
                      {({ open }) => (
                        <>
                          <Menu.Button
                            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                              isRoadmapPage
                                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                            }`}
                          >
                            Roadmaps
                            <ChevronDownIcon
                              className={`ml-1 h-4 w-4 transform transition-transform ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </Menu.Button>

                          <Menu.Items className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50 focus:outline-none">
                            <div className="py-1">
                              {roadmaps.map((roadmap) => (
                                <Menu.Item key={roadmap.id}>
                                  {({ active }) => (
                                    <Link
                                      href={`/roadmap/${roadmap.slug}`}
                                      className={`block px-4 py-2 text-sm ${
                                        active
                                          ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                          : "text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      <div className="font-medium">{roadmap.title}</div>
                                      {roadmap.description && (
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                          {roadmap.description}
                                        </div>
                                      )}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </>
                      )}
                    </Menu>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
