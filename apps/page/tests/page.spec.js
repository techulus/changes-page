const { expect, test, request } = require("@playwright/test");

test("visit page and take screenshot", async ({ page }) => {
  const targetUrl = process.env.ENVIRONMENT_URL || "https://hey.changes.page";

  const response = await page.goto(targetUrl);

  expect(response.status()).toBeLessThan(400);

  await page.screenshot({ path: "screenshot.jpg" });

  const context = await request.newContext({
    baseURL: targetUrl,
  });

  const latest = await context.get(`/latest.json`);
  expect(latest.ok()).toBeTruthy();

  const latestPost = await latest.json();
  const latestPostResponse = await page.goto(latestPost.url);
  expect(latestPostResponse.status()).toBeLessThan(400);
  await page.screenshot({ path: "latestPostResponse-screenshot.jpg" });
});

test("verify APIs", async () => {
  const targetUrl = process.env.ENVIRONMENT_URL || "https://hey.changes.page";

  const context = await request.newContext({
    baseURL: targetUrl,
  });

  const posts = await context.get(`/changes.json`);
  expect(posts.ok()).toBeTruthy();

  const robots = await context.get(`/robots.txt`);
  expect(robots.ok()).toBeTruthy();

  const sitemap = await context.get(`/sitemap.xml`);
  expect(sitemap.ok()).toBeTruthy();

  const markdown = await context.get(`/changes.md`);
  expect(markdown.ok()).toBeTruthy();

  const rss = await context.get(`/rss.xml`);
  expect(rss.ok()).toBeTruthy();

  const atom = await context.get(`/atom.xml`);
  expect(atom.ok()).toBeTruthy();
});
