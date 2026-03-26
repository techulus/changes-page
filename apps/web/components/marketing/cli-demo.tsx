import {
  LightningBoltIcon,
  ChipIcon,
  CodeIcon,
} from "@heroicons/react/solid";

const useCases = [
  {
    icon: LightningBoltIcon,
    title: "CI/CD Pipelines",
    description: "Auto-publish release notes on every deploy.",
  },
  {
    icon: ChipIcon,
    title: "AI Agents",
    description: "Let AI generate changelogs from your commits.",
  },
  {
    icon: CodeIcon,
    title: "GitHub Actions",
    description: "Sync PRs to changelog posts automatically.",
  },
];

export default function CliDemo() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl hero">
            Built for your pipeline
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            The{" "}
            <code className="text-green-400 bg-gray-800 px-1.5 py-0.5 rounded text-sm">
              chp
            </code>{" "}
            CLI gives you full control over your changelog from the command line.
          </p>
        </div>

        <div className="mt-16 mx-auto max-w-4xl">
          <div className="rounded-xl border border-white/10 bg-gray-950 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/80 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-xs text-gray-400 font-mono">
                  Terminal
                </span>
              </div>
            </div>

            <div className="p-6 font-mono text-sm leading-loose space-y-1 overflow-x-auto">
              <div>
                <span className="text-green-400">$ </span>
                <span className="text-white">npm install -g </span>
                <span className="text-cyan-400">@changespage/cli</span>
              </div>

              <div className="h-4" />

              <div>
                <span className="text-green-400">$ </span>
                <span className="text-white">export </span>
                <span className="text-cyan-400">CHANGESPAGE_SECRET_KEY</span>
                <span className="text-white">=</span>
                <span className="text-yellow-300">sk_live_...</span>
              </div>

              <div className="h-4" />

              <div>
                <span className="text-green-400">$ </span>
                <span className="text-white">echo </span>
                <span className="text-yellow-300">
                  &quot;## Bug Fixes
                </span>
              </div>
              <div>
                <span className="text-yellow-300">
                  - Fixed login timeout on mobile
                </span>
              </div>
              <div>
                <span className="text-yellow-300">
                  - Resolved dark mode rendering&quot;
                </span>
                <span className="text-white"> | chp posts create \</span>
              </div>
              <div className="pl-6">
                <span className="text-cyan-400">--title </span>
                <span className="text-yellow-300">
                  &quot;v2.4.1 Patch Release&quot;
                </span>
                <span className="text-white"> \</span>
              </div>
              <div className="pl-6">
                <span className="text-cyan-400">--tags </span>
                <span className="text-white">fix \</span>
              </div>
              <div className="pl-6">
                <span className="text-cyan-400">--status </span>
                <span className="text-white">published</span>
              </div>

              <div className="h-4" />

              <div className="text-gray-500">
                <span className="text-gray-600">{`{`}</span>
              </div>
              <div className="pl-4">
                <span className="text-gray-400">&quot;id&quot;</span>
                <span className="text-gray-600">: </span>
                <span className="text-yellow-300/70">
                  &quot;post_abc123&quot;
                </span>
                <span className="text-gray-600">,</span>
              </div>
              <div className="pl-4">
                <span className="text-gray-400">&quot;title&quot;</span>
                <span className="text-gray-600">: </span>
                <span className="text-yellow-300/70">
                  &quot;v2.4.1 Patch Release&quot;
                </span>
                <span className="text-gray-600">,</span>
              </div>
              <div className="pl-4">
                <span className="text-gray-400">&quot;status&quot;</span>
                <span className="text-gray-600">: </span>
                <span className="text-green-400/70">
                  &quot;published&quot;
                </span>
              </div>
              <div className="text-gray-600">{`}`}</div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="text-center rounded-xl bg-gray-800/30 border border-gray-700/50 p-6"
            >
              <useCase.icon className="h-8 w-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-gray-400">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
