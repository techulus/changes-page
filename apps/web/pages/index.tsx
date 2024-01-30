import dynamic from "next/dynamic";
import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import Features from "../components/marketing/features";
import GetStartedHero from "../components/marketing/get-started-hero";
import Hero from "../components/marketing/hero";
import PricingSection from "../components/marketing/pricing-section";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const FAQs = dynamic(() => import("../components/marketing/faq"));

export default function Index({ addons, unit_amount }) {
  return (
    <div className="h-full dark:bg-gray-800">
      <HeaderComponent />

      <main>
        <Hero />
        <Features />
        <PricingSection addons={addons} unit_amount={unit_amount} />
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

  return {
    props: {
      unit_amount,
      addons: [
        {
          name: "email notification",
          price: email_unit_amount / 100,
        },
      ],
    },
  };
}
