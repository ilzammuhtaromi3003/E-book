import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-img-element": "off", // Nonaktifkan peringatan untuk `<img>`
      "@typescript-eslint/no-explicit-any": "off", // Nonaktifkan peringatan untuk `any`
      "react-hooks/exhaustive-deps": "warn", // Ubah menjadi "warn" atau "off" jika perlu
    },
  },
];

export default eslintConfig;