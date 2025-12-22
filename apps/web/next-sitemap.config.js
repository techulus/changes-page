/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://changes.page",
  generateRobotsTxt: true, // (optional)
  // ...other options
  exclude: ["/pages", "/pages/*", "/account/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/pages",
          "/pages/*",
          "/account",
          "/account/*",
          "/api/*",
          "/login",
          "/_next/*",
        ],
      },
    ],
  },
};
