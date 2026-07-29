import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    loaders: ["tsx/esm"],
    include: ["test/scripts/**/*.test.ts"],
    exclude: ["node_modules", "dist", "scripts"],
  },
});
