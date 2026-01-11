import { describe, it, expect } from "vitest";
import { scan } from "../src/index.js";
import fs from "node:fs";
import path from "node:path";

describe("scanner", () => {
  it("should be defined", () => {
    expect(scan).toBeDefined();
  });

  // TODO: what we expect is just bullshits from AI - we want to expect the least amount of details, only what we need
  it("should scan a simple client component", () => {
    const fixturePath = path.join(
      process.cwd(),
      "test/fixtures/a-component.tsx"
    );
    const code = fs.readFileSync(fixturePath, "utf-8");

    const result = scan(code);

    expect(result).toMatchObject({
      isClient: true,
      imports: [
        {
          source: "react",
          specifiers: [
            {
              local: "ReactNode",
            },
          ],
        },
      ],
      components: [
        {
          name: "button",
        },
      ],
    });
  });
});
