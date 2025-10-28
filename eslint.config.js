
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  js.configs.recommended,
	{
		rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-redeclare": "off"
		},
	},
]);
