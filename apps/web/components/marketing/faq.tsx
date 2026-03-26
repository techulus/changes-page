import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/solid";
import { useMemo } from "react";

export default function FAQs() {
  const faqs = useMemo(
    () => [
      {
        id: "trial",
        question: "Do you offer a free trial?",
        answer:
          "Yes, 14 days free with no credit card required.",
      },
      {
        id: "can-i-customize-my-page",
        question: "Can I customize my page?",
        answer:
          "Yes. Custom domains with auto-provisioned SSL, plus full branding control over colors, logo, and cover image.",
      },
      {
        id: "can-i-receive-notifications",
        question: "Can users receive notifications about updates?",
        answer:
          "Yes, via email digests and RSS feeds.",
      },
      {
        id: "can-i-automate-my-page",
        question: "Can I automate my changelog?",
        answer:
          "Yes. Use the CLI, JSON API, GitHub Actions, or Zapier to publish updates from your pipeline.",
      },
      {
        id: "ai-agents",
        question: "Can AI agents create changelog posts?",
        answer:
          "Yes. The CLI accepts piped content via stdin with --tags and --status flags, so AI agents can create fully formatted posts programmatically.",
      },
      {
        id: "cli-required",
        question: "Do I need the CLI to use Changes.page?",
        answer:
          "No. The web interface provides full functionality. The CLI and API are additional interfaces for teams that want automation.",
      },
      {
        id: "is-changes-page-reliable",
        question: "Is Changes.page reliable?",
        answer:
          "Yes, 99.9%+ uptime with highly scalable and redundant infrastructure.",
      },
    ],
    []
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-16 lg:px-8">
        <div className="divide-y divide-gray-200 dark:divide-white/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white hero">
            Frequently asked questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-200 dark:divide-white/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.id} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button
                        id={faq.id}
                        className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white"
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
                    <Disclosure.Panel as="dd" className="mt-2 pr-4 sm:pr-12">
                      <p className="text-base leading-7 text-gray-600 dark:text-gray-300">
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
