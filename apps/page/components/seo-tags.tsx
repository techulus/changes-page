import { NextSeo } from "next-seo";
import Head from "next/head";
import { useMemo } from "react";
import {
  IPage,
  IPageSettings,
  IPost,
  PageTypeToLabel,
} from "@changes-page/supabase/types/page";
import { getOgUrl, getPageUrl } from "../lib/url";
import logoImage from "../public/logo.png";

const SeoTags = ({
  page,
  settings,
  posts,
  content = "",
  url = null,
}: {
  page: IPage;
  settings: IPageSettings;
  posts: IPost[];
  content?: string;
  url?: string | null;
}) => {
  const pageUrl = useMemo(() => getPageUrl(page, settings), [page, settings]);

  const ogImageUrl = useMemo(
    () => getOgUrl(page, settings, posts.length ? posts[0] : null, content),
    [page, settings, posts, content]
  );

  return (
    <>
      <Head>
        <meta name="theme-color" content="#262626" />
        <link rel="shortcut icon" href={settings?.page_logo || logoImage.src} />
      </Head>
      <NextSeo
        title={
          posts?.length
            ? `${posts[0].title} | ${page?.title}`
            : `${page?.title} | ${PageTypeToLabel[page?.type]}`
        }
        description={page?.description ?? ""}
        openGraph={{
          url: url || pageUrl,
          title: page?.title,
          description: page?.description ?? "",
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: page?.title,
              type: "image/png",
            },
          ],
          type: "website",
          siteName: page?.title,
        }}
        additionalMetaTags={[
          {
            property: "twitter:url",
            content: url || pageUrl,
          },
          {
            property: "twitter:image",
            content: ogImageUrl,
          },
        ]}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
    </>
  );
};

export default SeoTags;
