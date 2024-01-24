import classNames from "classnames";
import Image from "next/image";
import { IPage, IPageSettings } from "@changes-page/supabase/types/page";
import OptionalLink from "./optional-link";

export default function PageHeader({
  page,
  settings,
}: {
  page: IPage;
  settings: IPageSettings;
}) {
  return (
    <>
      {settings?.cover_image && (
        <div className="relative h-32 md:h-64 w-screen">
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
          "relative max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8",
          settings?.cover_image && settings?.page_logo && "-mt-24 z-50"
        )}
      >
        <div className="space-y-8 sm:space-y-12">
          <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
            <OptionalLink href={settings?.product_url}>
              {settings?.page_logo ? (
                <>
                  <Image
                    placeholder="blur"
                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    className="h-24 w-24 md:h-32 md:w-32 mx-auto bg-gray-100 dark:bg-gray-900 rounded-full p-2"
                    alt={page?.title}
                    src={settings?.page_logo}
                    width={128}
                    height={128}
                  />
                  <h1 className="hidden" aria-hidden>
                    {page?.title}
                  </h1>
                </>
              ) : (
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {page?.title}
                </h1>
              )}
            </OptionalLink>

            {page?.description && (
              <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                {page?.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
