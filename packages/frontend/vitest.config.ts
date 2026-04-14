import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: ["src/sst-env.d.ts", "src/trpc.ts"],
    },
  },
});
