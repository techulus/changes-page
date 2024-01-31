import FooterComponent from "../components/layout/footer.component";
import HeaderComponent from "../components/layout/header.component";
import PricingSection from "../components/marketing/pricing-section";
import StartForFreeFooter from "../components/marketing/start-for-free-footer";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default function Pricing({ unit_amount, addons }) {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <HeaderComponent />

      <PricingSection unit_amount={unit_amount} addons={addons} />

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
