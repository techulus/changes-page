import {
  BeakerIcon,
  CashIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CollectionIcon,
  HeartIcon,
  LightningBoltIcon,
  MailIcon,
  StarIcon,
} from "@heroicons/react/solid";
import Head from "next/head";
import Image from "next/image";
import { useMemo } from "react";
import appScreenshot from "../../public/images/hero/app-screenshot.png";

export default function Features() {
  const features = useMemo(
    () => [
      {
        name: "White-label",
        description:
          "Use your custom domain and branding to customize your page.",
        icon: StarIcon,
      },
      {
        name: "SEO friendly & fast",
        description:
          "Our pages are server side rendered, making them fast and search engine friendly.",
        icon: LightningBoltIcon,
      },
      {
        name: "Interactive Roadmaps",
        description:
          "Build public roadmaps with voting to engage your community and prioritize features together.",
        icon: CollectionIcon,
      },
      {
        name: "Notifications",
        description:
          "Effortlessly engage users with instant email & RSS notifications of updates.",
        icon: MailIcon,
      },
      {
        name: "Battle-tested reliability",
        description:
          "We've an industry leading 99.9%+ uptime and our systems are highly scalable and redundant.",
        icon: CheckCircleIcon,
      },
      {
        name: "Automate",
        description:
          "With the help of Zapier integration you can set your page on autopilot.",
        icon: BeakerIcon,
      },
      {
        name: "Audience Analytics",
        description:
          "Detailed insights into your page's visitors with metrics like top referrers, operating systems, and browser information.",
        icon: ChartBarIcon,
      },
      {
        name: "Designed for developers",
        description:
          "Your page is available in plain text, JSON and markdown format letting you easily embed it anywhere.",
        icon: HeartIcon,
      },
      {
        name: "Wallet-friendly",
        description:
          "Get your page up and running for just $5 with a 14-day free trial.",
        icon: CashIcon,
      },
    ],
    []
  );

  return (
    <div className="bg-gray-900 py-16 sm:py-32">
      <Head>
        <script
          type="module"
          src="https://cdn.zapier.com/packages/partner-sdk/v0/zapier-elements/zapier-elements.esm.js"
        ></script>
      </Head>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center font-semibold">
          <h2 className="text-xl leading-8 tracking-tight text-indigo-400">
            Proudly open-source
          </h2>
          <p className="mt-2 text-3xl tracking-tight text-white sm:text-4xl hero">
            An{" "}
            <span className="underline decoration-yellow-500 text-white">
              open-source
            </span>{" "}
            solution revolutionizing{" "}
            <span className="underline decoration-red-500 text-white">
              changelog
            </span>{" "}
            and{" "}
            <span className="underline decoration-blue-500 text-white">
              roadmap
            </span>{" "}
            management.
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Image
            src={appScreenshot}
            alt="App screenshot"
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-white/10"
            width={1216}
            height={767}
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-gray-900 pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-white">
                <feature.icon
                  className="absolute top-1 left-1 h-5 w-5 text-indigo-500"
                  aria-hidden="true"
                />
                {feature.name}
              </dt>{" "}
              <dd className="block">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <zapier-workflow
          client-id="rnKv828fHE7sPhcZdGhwqWbIsJkOfhUEh2RAHQw4"
          theme="dark"
          intro-copy-display="show"
          guess-zap-display="show"
          zap-create-from-scratch-display="show"
        />
      </div> */}
    </div>
  );
}
