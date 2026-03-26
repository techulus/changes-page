import {
  ChartBarIcon,
  CheckCircleIcon,
  CodeIcon,
  CogIcon,
  CollectionIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  PencilIcon,
  TerminalIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";

const humanFeatures = [
  { name: "Rich markdown editor with live preview", icon: PencilIcon },
  { name: "Interactive roadmap boards with voting", icon: CollectionIcon },
  { name: "Post scheduling and reactions", icon: LightningBoltIcon },
  { name: "Audience analytics dashboard", icon: ChartBarIcon },
  { name: "Team collaboration", icon: UserGroupIcon },
  { name: "Custom domains & white-label branding", icon: GlobeAltIcon },
];

const agentFeatures = [
  { name: "Full CRUD via chp CLI", icon: TerminalIcon },
  { name: "Pipe content from stdin", icon: CodeIcon },
  { name: "Auth via environment variables", icon: CogIcon },
  { name: "JSON output for scripting", icon: CodeIcon },
  { name: "GitHub Actions integration", icon: LightningBoltIcon },
  { name: "Zapier automation", icon: LightningBoltIcon },
];

export default function DualInterface() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl hero">
            Two interfaces. One platform.
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-300">
            Whether you&apos;re a product manager crafting a release story or a
            CI pipeline shipping automated updates, Changes.page delivers.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-gray-800/50 border border-gray-700 p-8 lg:p-10 hover:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <UserGroupIcon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">For Humans</h3>
            </div>
            <p className="text-gray-400 mb-8">
              A beautiful web interface for crafting changelogs that your users
              will love.
            </p>
            <ul className="space-y-4">
              {humanFeatures.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gray-800/50 border border-gray-700 p-8 lg:p-10 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <TerminalIcon className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">For Agents</h3>
            </div>
            <p className="text-gray-400 mb-8">
              A powerful CLI and API designed for automation, CI/CD pipelines,
              and AI agents.
            </p>
            <ul className="space-y-4">
              {agentFeatures.map((feature) => (
                <li key={feature.name} className="flex items-center gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
