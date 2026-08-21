import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";

export default defineConfig({
  root: "pages",
  base: "/soft-space-sensory/",
  plugins: [react()],
  publicDir: "../public",
  css: { postcss: { plugins: [tailwindcss()] } },
  build: { outDir: "../pages-dist", emptyOutDir: true },
});
