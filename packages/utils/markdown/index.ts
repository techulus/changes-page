import { remark } from "remark";
import stripMarkdown from "strip-markdown";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";

export function convertMarkdownToPlainText(markdown: string) {
  return remark().use(stripMarkdown).processSync(markdown).toString();
}

export function convertMarkdownToHtml(markdown: string) {
  return remark()
    .use(remarkParse)
    .use(remarkHtml)
    .processSync(markdown)
    .toString();
}
