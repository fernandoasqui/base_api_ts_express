import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Ignora arquivos JS comuns
  {
    ignores: ["**/*.js", "**/*.cjs", "**/*.mjs"]
  },

  // Para arquivos .json
  {
    files: ["**/*.json"],
    plugins: { json },
    languageOptions: {
      parser: json.parsers.JSON,
    },
  },

  // Para arquivos TypeScript/React
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      import: require("eslint-plugin-import")
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "prettier/prettier": "error",
      "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
      "react/react-in-jsx-scope": "off",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never"
        }
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          },
          "newlines-between": "always"
        }
      ],
      "react/jsx-props-no-spreading": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "react/jsx-no-bind": "off"
    },
    extends: [
      "airbnb",
      "plugin:react-hooks/recommended",
      "prettier"
    ]
  }
]);
