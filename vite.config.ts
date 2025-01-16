import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const currentDate = new Date()
  .toLocaleDateString("en-UK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  .replace(/ /g, "-");

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: "/",
  plugins: [react()],
  define: {
    BUILD_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_DATE: JSON.stringify(currentDate),
    RESOURCES_URL: JSON.stringify(
      command === "serve"
        ? "/static-resources"
        : "https://resources.mesbg-list-builder.com/v2024",
    ),
    API_URL: JSON.stringify("https://api.mesbg-list-builder.com/v2024"),
  },
  build: {
    outDir: "./build",
    emptyOutDir: true,
  },
}));
