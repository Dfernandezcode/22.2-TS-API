module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "standard-with-typescript",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  ignorePatterns: ["dist/"], // ignore folder: dist/
  lint: ["src/**/*.ts", "index.ts"], // exclude index.ts from linting.
  rules: {
    "semi": "off",
    "space-before-function-paren": "off",
    "quotes": [2, "double"],
    "quote-props": [2, "consistent"],
    "multiline-ternary": "off",
    "comma-dangle": "off",
    "@typescript-eslint/quotes": [2, "double"],
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/comma-dangle": "off",
  },
};
