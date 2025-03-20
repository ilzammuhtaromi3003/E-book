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
      "@typescript-eslint/no-unused-vars": "off", // Tambahkan ini untuk mengabaikan variabel yang tidak digunakan
      "react-hooks/exhaustive-deps": "off", // Ubah menjadi "off"
    },
  },
];

export default eslintConfig;