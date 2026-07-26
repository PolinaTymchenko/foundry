import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// tsup could not be made to actually scope CSS Modules class names — it
// intercepts .module.css imports with its own pre-esbuild-CSS-modules
// handling, so neither esbuild's native local-css loader nor a dedicated
// esbuild plugin ever got a chance to run (verified empirically, not
// assumed). Vite's CSS Modules support is mature and already proven
// correct in this exact repo, via Storybook — so packages with CSS build
// with Vite; pure-TS packages (tokens, and Foundry's own CLI/engine) stay
// on tsup, which is a better fit for them specifically.
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
    sourcemap: true,
    cssCodeSplit: false,
    emptyOutDir: true,
  },
});
