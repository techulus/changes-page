import dynamic from "next/dynamic";
import Head from "next/head";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import Features from "../components/marketing/features";
import GetStartedHero from "../components/marketing/get-started-hero";
import Hero from "../components/marketing/hero";
import PricingSection from "../components/marketing/pricing-section";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const FAQs = dynamic(() => import("../components/marketing/faq"));

export default function Index({ addons, unit_amount, stars }) {
  return (
    <div className="h-full dark:bg-gray-800">
      <Head>
        <title>
          Changes.page - Changelog & Roadmap Platform for Product Teams
        </title>
        <meta
          name="description"
          content="Create beautiful changelogs and interactive roadmaps. Share what you've built and what's coming next. Notify users, gather feedback with voting, and track engagement with analytics."
        />
        {/* FAQ Schema for SEO */}
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
                  name: "Is changes.page SEO friendly?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, our pages are server side rendered, making them fast and search engine friendly.",
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
                  name: "Is changes.page reliable?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we have an industry-leading 99.9%+ uptime and our systems are highly scalable and redundant.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I automate my changelog page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can automate your page with the help of Zapier integration.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I see audience analytics for my page?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can see detailed insights into your page's visitors with metrics such as top referrers, operating systems, and browser information.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you support markdown?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we use a markdown editor for writing posts in your page.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do you support roadmaps?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can create interactive roadmap boards with voting functionality to engage your community and prioritize features together.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <HeaderComponent />

      <main>
        <section>
          <Hero stars={stars} />
        </section>
        <Features />
        <PricingSection addons={addons} unit_amount={unit_amount} />
        <GetStartedHero />
        <FAQs />
      </main>

      <FooterComponent />
    </div>
  );
}

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
    },
    revalidate: 86400,
  };
}
