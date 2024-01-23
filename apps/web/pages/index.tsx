import dynamic from "next/dynamic";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import Features from "../components/marketing/features";
import GetStartedHero from "../components/marketing/get-started-hero";
import Hero from "../components/marketing/hero";
import PricingSection from "../components/marketing/pricing-section";
import { ROUTES } from "../data/routes.data";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const FAQs = dynamic(() => import("../components/marketing/faq"));

export default function Index({ tiers, unit_amount }) {
  return (
    <div className="h-full dark:bg-gray-800">
      <HeaderComponent />

      <main>
        <Hero />
        <Features />
        <PricingSection tiers={tiers} unit_amount={unit_amount} />
        <FAQs />
        <GetStartedHero />
      </main>

      <FooterComponent />
    </div>
  );
}
export async function getStaticProps() {
  const { unit_amount } = await stripe.prices.retrieve(
    process.env.STRIPE_PRICE_ID
  );
  const { unit_amount: email_unit_amount } = await stripe.prices.retrieve(
    process.env.EMAIL_NOTIFICATION_STRIPE_PRICE_ID
  );

  const tiers = [
    {
      featured: false,
      id: "free",
      name: "Hobby",
      href: ROUTES.PAGES,
      priceMonthly: 0,
      description: "Limited number of pages & customisation.",
      addons: [],
      features: [
        "2 Pages",
        "Unlimited Posts",
        "Zapier Integration",
        "Embeddable Widget",
        "Post Scheduling",
        "Audience Analytics",
        "SEO Friendly",
      ],
    },
    {
      featured: true,
      id: "pro",
      name: "Pro",
      href: ROUTES.PAGES,
      priceMonthly: unit_amount / 100,
      addons: [
        {
          name: "email notification",
          price: email_unit_amount / 100,
        },
      ],
      description: "Everything in Hobby, plus more.",
      features: [
        "Unlimited Pages",
        `Email notifications`,
        "Custom domain + SSL",
        "White labeling",
        "AI Assistant",
        "Priority Support",
      ],
    },
  ];

  return {
    props: {
      tiers,
      unit_amount,
    },
  };
}
