
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  js.configs.recommended,
	{
		rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-redeclare": "off",
      "no-unassigned-vars": "off",
      "no-useless-assignment": "off"
		},
	},
  {
    files: ["**/*.jsx"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    extends: [reactHooks.configs.flat.recommended],
  },
]);
