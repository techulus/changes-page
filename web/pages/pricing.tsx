import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import PricingSection from "../components/marketing/pricing-section";
import StartForFreeFooter from "../components/marketing/start-for-free-footer";
import { ROUTES } from "../data/routes.data";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default function Pricing({ unit_amount, tiers }) {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <HeaderComponent />

      <PricingSection unit_amount={unit_amount} tiers={tiers} />

      <StartForFreeFooter />
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
