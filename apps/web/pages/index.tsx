import dynamic from "next/dynamic";
import Head from "next/head";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import Features from "../components/marketing/features";
import GetStartedHero from "../components/marketing/get-started-hero";
import Hero from "../components/marketing/hero";
import OpenSourceBanner from "../components/marketing/open-source-banner";
import PricingSection from "../components/marketing/pricing-section";
import { createChangesPageClient } from "@changespage/react";
import { InferGetStaticPropsType } from "next";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const FAQs = dynamic(() => import("../components/marketing/faq"));

async function getGitHubStars(): Promise<string | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/techulus/changes-page",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!response?.ok) {
      return null;
    }

    const json = await response.json();

    return parseInt(json.stargazers_count, 10).toLocaleString();
  } catch {
    return null;
  }
}

export async function getStaticProps() {
  const { unit_amount } = await stripe.prices.retrieve(
    process.env.STRIPE_PRICE_ID
  );
  const { unit_amount: email_unit_amount } = await stripe.prices.retrieve(
    process.env.EMAIL_NOTIFICATION_STRIPE_PRICE_ID
  );
  const stars = await getGitHubStars();

  const client = createChangesPageClient({
    baseUrl: "https://hey.changes.page",
  });
  const latestPost = await client.getLatestPost();

  return {
    props: {
      unit_amount,
      addons: [
        {
          name: "email notification",
          price: email_unit_amount / 100,
        },
      ],
      stars,
      latestPost,
    },
    revalidate: 86400,
  };
}

export default function Index({
  addons,
  unit_amount,
  stars,
  latestPost,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="h-full bg-white dark:bg-gray-900">
      <Head>
        <title>
          Changes.page — The Changelog Platform for Humans and Agents
        </title>
        <meta
          name="description"
          content="Create changelogs and roadmaps through a beautiful web editor or automate them via CLI and API. Open-source, designed for product teams and CI/CD pipelines."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Do you offer free trial?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we offer a 14 days free trial.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need to enter a credit card to create a page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, you don't need to enter a credit card to create a page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I customize my page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can use your custom domain and branding to customize your page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you support custom domains?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we also provision SSL certificates for your custom domain.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can users receive notifications about updates?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, users can receive instant email and RSS notifications about updates.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I automate my changelog page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can automate your page using the CLI, API, GitHub Actions, or Zapier integration.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can AI agents create changelog posts?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. The CLI is designed for automation. AI agents can pipe content via stdin and use the --tags and --status flags to create fully formatted posts programmatically.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <HeaderComponent />

      <main>
        <Hero latestPost={latestPost} />
        <Features />
        <OpenSourceBanner stars={stars} />
        <PricingSection addons={addons} unit_amount={unit_amount} />
        <GetStartedHero />
        <FAQs />
      </main>

      <FooterComponent />
    </div>
  );
}
