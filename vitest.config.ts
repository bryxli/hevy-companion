import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["packages/*/src/**/*.{ts,tsx,js,jsx}"],
      exclude: ["packages/core/src/index.ts", "packages/core/src/schemas.ts"],
    },
  },
});
