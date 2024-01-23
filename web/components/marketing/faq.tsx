import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/solid";
import { useMemo } from "react";

export default function FAQs() {
  const faqs = useMemo(
    () => [
      {
        id: "trial",
        question: "Do you offer free trial?",
        answer: "Yes, we offer a 14 days free trial.",
      },
      {
        id: "card",
        question: "Do I need to enter a credit card to create a page?",
        answer: "No, you don't need to enter a credit card to create a page.",
      },
      {
        id: "can-i-customize-my-page",
        question: "Can I customize my page?",
        answer:
          "Yes, you can use your custom domain and branding to customize your page.",
      },
      {
        id: "domain",
        question: "Do you support custom domains?",
        answer:
          "Yes, we also provision SSL certificates for your custom domain.",
      },
      {
        id: "is-changes-page-seo-friendly",
        question: "Is changes.page SEO friendly?",
        answer:
          "Yes, our pages are server side rendered, making them fast and search engine friendly.",
      },
      {
        id: "can-i-receive-notifications",
        question: "Can users receive notifications about updates?",
        answer:
          "Yes, users can receive instant email and RSS notifications about updates.",
      },
      {
        id: "is-changes-page-reliable",
        question: "Is changes.page reliable?",
        answer:
          "Yes, we have an industry-leading 99.9%+ uptime and our systems are highly scalable and redundant.",
      },
      {
        id: "can-i-automate-my-page",
        question: "Can I automate my changelog page?",
        answer:
          "Yes, you can automate your page with the help of Zapier integration.",
      },
      {
        id: "can-i-see-audience-analytics",
        question: "Can I see audience analytics for my page?",
        answer:
          "Yes, you can see detailed insights into your page's visitors with metrics such as top referrers, operating systems, and browser information.",
      },
      {
        id: "md",
        question: "Do you support markdown?",
        answer: "Yes, we use a markdown editor for writing posts in your page.",
      },
    ],
    []
  );

  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-white/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-white hero">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-white/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.id} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button
                        id={faq.id}
                        className="flex w-full items-start justify-between text-left text-white"
                      >
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-300">
                        {faq.answer}
                      </p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
