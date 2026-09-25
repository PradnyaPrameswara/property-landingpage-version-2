import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist", ".astro"]),
  {
    files: ["**/*.{ts,tsx}", "**/*.{js,mjs,cjs}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "no-restricted-imports": ["error", { paths: [{ name: "cmdk", message: "Use Base-UI combobox instead." }], patterns: [{ group: ["@radix-ui/*"], message: "Base UI only." }, { group: ["cmdk", "cmdk/*"], message: "Use Base-UI combobox instead." }, { group: ["jquery", "jquery/*"], message: "No jQuery in MVP." }] }],
    },
  },
])
