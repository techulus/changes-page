import postcss from "postcss";

const unsafeProperties = ["behavior", "-moz-binding"];
const unsafeValues = ["expression", "javascript:", "vbscript:"];

export function sanitizeCss(cssString: string) {
  const root = postcss.parse(cssString);

  root.walkDecls((decl: any) => {
    // Remove declarations with unsafe properties
    if (unsafeProperties.includes(decl.prop)) {
      decl.remove();
      return;
    }

    // Remove declarations with unsafe values
    for (const unsafeValue of unsafeValues) {
      if (decl.value.includes(unsafeValue)) {
        decl.remove();
        return;
      }
    }

    // Remove URLs with unsafe protocols
    const urlPattern = /url\(\s*['"]?\s*(.*?)\s*['"]?\s*\)/;
    const matches = decl.value.match(urlPattern);
    if (
      matches &&
      (matches[1].startsWith("javascript:") ||
        matches[1].startsWith("data:") ||
        matches[1].startsWith("vbscript:"))
    ) {
      decl.remove();
      return;
    }
  });

  return root.toString();
}
