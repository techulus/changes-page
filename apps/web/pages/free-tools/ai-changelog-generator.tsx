import { SpinnerWithSpacing } from "@changes-page/ui";
import { LightningBoltIcon, RefreshIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { InferGetStaticPropsType } from "next";
import { useCallback, useState } from "react";
import {
  createToastWrapper,
  notifyError,
  notifySuccess,
} from "../../components/core/toast.component";
import FooterComponent from "../../components/layout/footer.component";
import MarketingHeaderComponent from "../../components/marketing/marketing-header.component";
import { track } from "../../utils/analytics";
import usePrefersColorScheme from "../../utils/hooks/usePrefersColorScheme";

export default function AIChangelogGenerator({
  title,
  description,
  modelStreamUrl,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const theme = usePrefersColorScheme();

  const [content, setContent] = useState("");
  const [addIntroOutro, setAddIntroOutro] = useState(true);
  const [soundCasual, setSoundCasual] = useState(true);

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generateChangelog = useCallback(async () => {
    if (!content.trim()) {
      notifyError("Please enter your commit messages or PR titles");
      return;
    }

    track("FreeTools-AiChangelogGenerator-Generate");

    setLoading(true);

    const response = await fetch(modelStreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        intro: addIntroOutro
          ? "Add a short intro and outro, make sure its generic and polite."
          : "Do not add any introduction or additional content at the beginnning or end.",
        tone: soundCasual ? "casual" : "formal",
      }),
    });

    if (!response.ok) {
      notifyError("Too many requests");
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    setLoading(false);
    setCompleted(false);

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setResult((prev) => (prev ?? "") + chunkValue);
    }

    setCompleted(true);
  }, [content, addIntroOutro, soundCasual, modelStreamUrl]);

  return (
    <div className="bg-gray-800 min-h-screen">
      {createToastWrapper(theme)}
      <MarketingHeaderComponent title={title} description={description} />
      <div className="relative isolate bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
          <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 ring-white/5 lg:w-1/2">
                <svg
                  className="absolute inset-0 h-full w-full stroke-gray-700 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2"
                      width={200}
                      height={200}
                      x="100%"
                      y={-1}
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M130 200V.5M.5 .5H200" fill="none" />
                    </pattern>
                  </defs>
                  <svg
                    x="100%"
                    y={-1}
                    className="overflow-visible fill-gray-800/20"
                  >
                    <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                  </svg>
                  <rect
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                    fill="url(#54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2)"
                  />
                </svg>
                <div
                  className="absolute -left-56 top-[calc(100%-13rem)] transform-gpu blur-3xl lg:left-[max(-14rem,calc(100%-59rem))] lg:top-[calc(50%-7rem)]"
                  aria-hidden="true"
                >
                  <div
                    className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#80caff] to-[#4f46e5] opacity-20"
                    style={{
                      clipPath:
                        "polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)",
                    }}
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white hero">
                {title}
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                {description}
              </p>
              <p className="mt-6 text-md leading-8 text-gray-300">
                You can customise the content using the following options:
              </p>

              <fieldset className="mt-6">
                <legend className="sr-only">Options</legend>
                <div className="space-y-5">
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={addIntroOutro}
                        onChange={(e) => setAddIntroOutro(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor="intro-outro"
                        className="font-medium text-white"
                      >
                        Add Intro & Outro
                      </label>
                      <p id="intro-outro" className="text-gray-400">
                        Suitable for sharing changelog as en email
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={soundCasual}
                        onChange={(e) => setSoundCasual(e.target.checked)}
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor="sound-casual"
                        className="font-medium text-white"
                      >
                        Sound casual
                      </label>
                      <p id="sound-casual" className="text-gray-400">
                        Write in a casual tone, less formal
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          {loading ? (
            <div className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
              <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <SpinnerWithSpacing />
              </div>
            </div>
          ) : result ? (
            <div className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
              <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold leading-6 text-white"
                    >
                      Here is a draft:
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        rows={16}
                        className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        value={result}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setResult(null)}
                    className={classNames(
                      "rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                      "disabled:bg-gray-500"
                    )}
                    disabled={!completed}
                  >
                    <RefreshIcon className="inline h-4 w-4 mr-2" /> Start over
                  </button>
                  <button
                    onClick={() => {
                      navigator?.clipboard?.writeText(result);
                      notifySuccess("Text has been copied to clipboard");
                    }}
                    className={classNames(
                      "ml-2 rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    )}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form
              className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48"
              onSubmit={(e) => {
                e.preventDefault();
                generateChangelog();
              }}
            >
              <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold leading-6 text-white"
                    >
                      Commit messages / PR titles / Bullet points
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        name="message"
                        id="message"
                        rows={16}
                        className="block w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        value={content}
                        onChange={(e) => {
                          setContent(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className={classNames(
                      "rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
                      "disabled:bg-gray-500"
                    )}
                    disabled={loading}
                  >
                    <LightningBoltIcon className="inline h-4 w-4 mr-2" />{" "}
                    Generate
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "ChangeCraftAI: Free Changelog Generator",
      description:
        "Say goodbye to the tedious task of writing changelog and release notes. Our revolutionary tool powered by GPT-3 automatically generates them for you, and it's completely free!",
      modelStreamUrl: `https://manageprompt.com/api/run/${process.env.MANAGEPROMPT_CHANGEGPT_WORKFLOW_ID}/stream`,
    },
  };
}
