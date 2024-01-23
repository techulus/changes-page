import * as React from "react";

/**
 * React hook for determining the preferred color scheme (aka 'prefers-color-scheme').
 * When server side rendered returns `no-preference`.
 *
 * @see [Usage] https://github.com/rfoel/use-prefers-color-scheme#usage
 * @returns {string} String, one of `dark`, `light`, `no-preference`
 */
export const usePrefersColorScheme = () => {
  const [preferredColorSchema, setPreferredColorSchema] = React.useState<
    "dark" | "light" | "no-preference"
  >("no-preference");

  // On first render:
  //   - Ensure window.matchMedia is supported
  //   - Initialize MediaQueryList objects
  //   - Check initial state
  //   - Subscribe on changes
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    // 1. define MediaQueryList observables
    const isDark = window.matchMedia("(prefers-color-scheme: dark)");
    const isLight = window.matchMedia("(prefers-color-scheme: light)");

    // 2. get initial state
    setPreferredColorSchema(
      isDark.matches ? "dark" : isLight.matches ? "light" : "no-preference"
    );

    // 3. subscribe on changes
    //
    // Is modern "matchMedia" implementation ???
    if (typeof isLight.addEventListener === "function") {
      // In modern browsers MediaQueryList should subclass EventTarget
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
      const darkListener = ({ matches }: MediaQueryListEvent) => {
        matches && setPreferredColorSchema("dark");
      };
      const lightListener = ({ matches }: MediaQueryListEvent) => {
        matches && setPreferredColorSchema("light");
      };
      isDark.addEventListener("change", darkListener);
      isLight.addEventListener("change", lightListener);
      return () => {
        isDark.removeEventListener("change", darkListener);
        isLight.removeEventListener("change", lightListener);
      };
    }

    // Is the old "matchMedia" implementation ???
    if (typeof isLight.addListener === "function") {
      // In some early implementations MediaQueryList existed, but did not
      // subclass EventTarget
      const listener = () =>
        setPreferredColorSchema(
          isDark.matches ? "dark" : isLight.matches ? "light" : "no-preference"
        );
      // This is two state updates if a user changes from dark to light, but
      // both state updates will be consistent and should be batched by React,
      // resulting in only one re-render
      isDark.addListener(listener);
      isLight.addListener(listener);
      return () => {
        isDark.removeListener(listener);
        isLight.removeListener(listener);
      };
    }

    // Is an unknown implementation case ???
    return;
  }, []);

  return preferredColorSchema;
};

export default usePrefersColorScheme;
