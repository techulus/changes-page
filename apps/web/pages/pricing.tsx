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

      <div className="bg-gray-900 py-8 text-center">
        <p className="text-sm text-gray-400">
          Questions about pricing?{" "}
          <a
            href="https://techulus.atlassian.net/servicedesk/customer/portal/1/group/1/create/2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Contact support
          </a>
        </p>
      </div>

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
