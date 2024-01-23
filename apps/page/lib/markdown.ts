async function convertMarkdownToPlainText(markdown: string) {
  const { remark } = await import("remark");
  const strip = (await import("strip-markdown")).default;

  return remark().use(strip).processSync(markdown).toString();
}

async function convertMarkdownToHtml(markdown: string) {
  const { remark } = await import("remark");
  const html = (await import("remark-html")).default;
  const parse = (await import("remark-parse")).default;

  return remark().use(parse).use(html).processSync(markdown).toString();
}

export {
  // Helpers
  convertMarkdownToPlainText,
  convertMarkdownToHtml,
};
