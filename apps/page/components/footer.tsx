import { IPageSettings } from "@changespage/supabase/types/page";
import Image from "next/image";
import { useEffect } from "react";
import { PageRoadmap } from "../lib/data";
import appStoreBadgeLight from "../public/badges/App_Store_Badge_US-UK_RGB_blk.svg";
import appStoreBadgeDark from "../public/badges/App_Store_Badge_US-UK_RGB_wht.svg";
import googlePlayBadge from "../public/badges/google-play-badge.png";
import { httpPost } from "../utils/http";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  TwitterIcon,
  YouTubeIcon,
} from "./social-icons.component";
import VisitorStatus from "./visitor-status";

export default function Footer({
  settings,
  roadmaps = [],
}: {
  settings: IPageSettings;
  roadmaps?: PageRoadmap[];
}) {
  useEffect(() => {
    httpPost({
      url: "/api/pa/view",
      data: { page_path: location.pathname, referrer: document.referrer },
    }).catch((e) => console.error(e));
  }, []);

  return (
    <footer>
      {(roadmaps ?? []).length ? (
        <div className="pt-4 py-2 flex justify-center space-x-6">
          <VisitorStatus />
        </div>
      ) : null}

      {(settings?.app_store_url || settings?.play_store_url) && (
        <p className="pt-4 py-4 flex justify-center space-x-6">
          {settings?.app_store_url ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={settings?.app_store_url}
            >
              <picture>
                <source
                  srcSet={appStoreBadgeDark.src}
                  media="(prefers-color-scheme: dark)"
                />
                <Image
                  className="h-10 w-auto"
                  height={40}
                  width={120}
                  src={appStoreBadgeLight}
                  alt="Download from App Store"
                />
              </picture>
            </a>
          ) : (
            <></>
          )}

          {settings?.play_store_url ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={settings?.play_store_url}
            >
              <Image
                className="h-10 w-auto"
                height={40}
                width={135}
                src={googlePlayBadge}
                alt="Download from Play Store"
              />
            </a>
          ) : (
            <></>
          )}
        </p>
      )}

      {(settings?.twitter_url ||
        settings?.github_url ||
        settings?.instagram_url ||
        settings?.facebook_url ||
        settings?.youtube_url ||
        settings?.linkedin_url ||
        settings?.tiktok_url) && (
        <div className="py-6 flex justify-center space-x-6">
          {settings?.twitter_url && (
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={settings?.twitter_url}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          )}

          {settings?.github_url && (
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={settings?.github_url}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">GitHub</span>
              <GithubIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          )}

          {settings?.linkedin_url && (
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={settings?.linkedin_url}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          )}

          {settings?.youtube_url && (
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={settings?.youtube_url}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">YouTube</span>
              <YouTubeIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          )}

          {settings?.instagram_url && (
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={settings?.instagram_url}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          )}

          {settings?.facebook_url && (
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={settings?.facebook_url}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Facebook</span>
              <FacebookIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          )}

          {settings?.tiktok_url && (
            <a
              target={"_blank"}
              rel="noopener noreferrer"
              href={settings?.tiktok_url}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">TikTok</span>
              <TikTokIcon className="h-6 w-6" aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {!settings?.whitelabel ? (
        <p className="py-8 text-center">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://changes.page"
            title="changes.page"
          >
            <button className="text-xs font-medium text-gray-600 dark:text-gray-300 inline-flex">
              ⚡ Powered by changes.page
            </button>
          </a>
        </p>
      ) : (
        <div className="py-8" />
      )}
    </footer>
  );
}
