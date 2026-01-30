import { defineProject } from "vitest/config";
import path from "path";

export default defineProject({
  test: {
    name: "node",
    root: path.dirname(new URL(import.meta.url).pathname),
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts"],
    },
  },
});
