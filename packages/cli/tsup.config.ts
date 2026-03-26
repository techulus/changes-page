import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  define: {
    __CLI_VERSION__: JSON.stringify(pkg.version),
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
});
