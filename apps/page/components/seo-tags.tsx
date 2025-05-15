import {
  IPage,
  IPageSettings,
  PageTypeToLabel,
} from "@changes-page/supabase/types/page";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useMemo } from "react";
import { getOgUrl, getPageUrl } from "../lib/url";
import logoImage from "../public/logo.png";

const SeoTags = ({
  page,
  settings,
  title = null,
  description = null,
  url = null,
}: {
  page: IPage;
  settings: IPageSettings;
  title?: string | null;
  description?: string | null;
  url?: string | null;
}) => {
  const pageUrl = useMemo(() => getPageUrl(page, settings), [page, settings]);

  const truncatedDescription = useMemo(() => {
    if (!description) return null;
    return description.length > 150
      ? description.substring(0, 150) + "..."
      : description;
  }, [description]);

  const ogImageUrl = useMemo(
    () => getOgUrl(page, settings, title, truncatedDescription),
    [page, settings, title, truncatedDescription]
  );

  return (
    <>
      <Head>
        <meta name="theme-color" content="#262626" />
        <link rel="shortcut icon" href={settings?.page_logo || logoImage.src} />
      </Head>
      <NextSeo
        title={
          title
            ? `${title} | ${page?.title}`
            : `${page?.title} | ${PageTypeToLabel[page?.type]}`
        }
        description={
          truncatedDescription ??
          page?.description ??
          PageTypeToLabel[page?.type]
        }
        canonical={url || pageUrl}
        openGraph={{
          url: url || pageUrl,
          title: title ?? page?.title,
          description:
            truncatedDescription ??
            page?.description ??
            PageTypeToLabel[page?.type],
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
