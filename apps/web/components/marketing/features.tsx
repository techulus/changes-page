import {
  BeakerIcon,
  ChartBarIcon,
  CodeIcon,
  CollectionIcon,
  GlobeAltIcon,
  LightningBoltIcon,
  MailIcon,
  PencilIcon,
  StarIcon,
  TerminalIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { Tab } from "@headlessui/react";

const tabColors = {
  "For your team": {
    bg: "bg-indigo-500/10",
    icon: "text-indigo-600 dark:text-indigo-400",
    pill: "bg-indigo-600",
  },
  "For your pipeline": {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-600 dark:text-emerald-400",
    pill: "bg-emerald-600",
  },
  "For your brand": {
    bg: "bg-violet-500/10",
    icon: "text-violet-600 dark:text-violet-400",
    pill: "bg-violet-600",
  },
} as const;

const tabs = [
  {
    name: "For your team" as const,
    features: [
      {
        name: "Rich markdown editor",
        description: "Full-featured editor with live preview and image uploads.",
        icon: PencilIcon,
      },
      {
        name: "Interactive roadmaps",
        description: "Public roadmap boards with community voting.",
        icon: CollectionIcon,
      },
      {
        name: "Scheduling & reactions",
        description: "Schedule posts and let users react to updates.",
        icon: LightningBoltIcon,
      },
      {
        name: "Audience analytics",
        description: "Visitor insights with referrers, OS, and browser data.",
        icon: ChartBarIcon,
      },
      {
        name: "Team collaboration",
        description: "Invite members and collaborate on changelogs.",
        icon: UserGroupIcon,
      },
    ],
  },
  {
    name: "For your pipeline" as const,
    features: [
      {
        name: "CLI operations",
        description: "Full CRUD via the chp CLI from your terminal or CI/CD.",
        icon: TerminalIcon,
      },
      {
        name: "JSON API & RSS",
        description: "Your page available as JSON, RSS, and plain text.",
        icon: CodeIcon,
      },
      {
        name: "GitHub Changelog Agent",
        description: "AI-powered changelog generation from commits and PRs.",
        icon: BeakerIcon,
      },
      {
        name: "GitHub Actions",
        description: "Publish changelogs directly from your workflow.",
        icon: LightningBoltIcon,
      },
      {
        name: "Zapier automation",
        description: "Connect to 5,000+ apps and automate your changelog.",
        icon: BeakerIcon,
      },
    ],
  },
  {
    name: "For your brand" as const,
    features: [
      {
        name: "Custom domains + SSL",
        description: "Your own domain with auto-provisioned SSL certificates.",
        icon: GlobeAltIcon,
      },
      {
        name: "White-label branding",
        description: "Customize colors, logo, and cover image.",
        icon: StarIcon,
      },
      {
        name: "SEO friendly",
        description: "Server-side rendered pages, fast and search optimized.",
        icon: LightningBoltIcon,
      },
      {
        name: "Email & RSS notifications",
        description: "Keep users informed with email digests and RSS feeds.",
        icon: MailIcon,
      },
      {
        name: "React SDK & widget",
        description: "Embed changelogs anywhere with the SDK or JS widget.",
        icon: CodeIcon,
      },
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Features() {
  return (
    <div className="bg-white dark:bg-gray-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl hero">
            Everything you need to ship updates
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            A complete platform for crafted announcements and automated releases.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
        <Tab.Group>
          <Tab.List className="flex justify-start gap-2 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:overflow-visible">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    "rounded-full px-5 py-2 text-sm font-semibold transition-colors focus:outline-none whitespace-nowrap",
                    selected
                      ? `${tabColors[tab.name].pill} text-white`
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-12">
            {tabs.map((tab) => (
              <Tab.Panel key={tab.name}>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {tab.features.map((feature) => (
                    <div key={feature.name} className="relative pl-12">
                      <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                        <div className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-lg ${tabColors[tab.name].bg}`}>
                          <feature.icon
                            className={`h-5 w-5 ${tabColors[tab.name].icon}`}
                            aria-hidden="true"
                          />
                        </div>
                        {feature.name}
                      </dt>
                      <dd className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
