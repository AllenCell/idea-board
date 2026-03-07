import eslint from '@eslint/js';
import globals from "globals";
import tseslint from "typescript-eslint";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import { defineConfig } from "eslint/config";

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: { globals: { ...globals.node } },
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "sort-destructure-keys": sortDestructureKeys,
        },
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error"],
            "sort-destructure-keys/sort-destructure-keys": [
                2,
                { caseSensitive: false },
            ],
            "@typescript-eslint/no-require-imports": "off",
        },
    },
]);