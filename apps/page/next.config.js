const withBundleAnalyzer = require("@next/bundle-analyzer")({});

const ContentSecurityPolicy = `
  script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: *;
  style-src 'self' data: 'unsafe-inline';
  img-src 'self' * data:;
  font-src 'self';
  connect-src 'self' wss: *.supabase.co *.changes.page *.intercom.io *.sentry.io vercel.live *.zapier.com;
  report-to default
`;

const cspReportUri = "https://hey.changes.page/api/debug/csp-report";

const securityHeaders = [
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "report-uri",
    value: cspReportUri,
  },
  {
    key: "report-to",
    value: JSON.stringify({
      group: "default",
      max_age: 10886400,
      endpoints: [
        {
          url: cspReportUri,
        },
      ],
      include_subdomains: true,
    }),
  },
];

// Your existing module.exports
const moduleExports = {
  async headers() {
    return [
      {
        // Apply these headers to all routes expect /api/*
        source: "/((?!api$|api/).*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      // SEO
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      // Markdown
      {
        source: "/changes.md",
        destination: "/api/markdown",
      },
      // RSS
      {
        source: "/rss.xml",
        destination: "/api/rss",
      },
      {
        source: "/atom.xml",
        destination: "/api/rss",
      },
      // APIs
      {
        source: "/changes.json",
        destination: "/api/json",
      },
      {
        source: "/latest.json",
        destination: "/api/latest",
      },
      {
        source: "/pinned.json",
        destination: "/api/pinned",
      },
    ];
  },
  images: {
    domains: [
      "pdwvetqkhfagwmkvduod.supabase.co",
      "eainhsncogzypzcrwpsp.supabase.co",
    ],
  },
};

module.exports =
  process.env.ANALYZE === "true"
    ? withBundleAnalyzer(moduleExports)
    : moduleExports;

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "techulus-llc",
    project: "user-changes-page",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
