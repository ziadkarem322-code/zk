import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    // Build output, migration scripts (plain Node, not part of the Next.js app graph),
    // and the vendored design prototype (README: support.js is "not part of the
    // design — ignore entirely"; deck-stage.js is prototype infra we've replaced).
    ignores: [
      ".next/**",
      "scripts/**",
      "deck-stage.js",
      "support.js",
      "next-env.d.ts",
      "eslint-report.json",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
