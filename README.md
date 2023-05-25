## 22.2 - NOTES

NOTES - Project setup for Node with Typescript.

---

Install list.

1. express - npm i express
2. dotenv - npm i dotenv
3. cors - npm i cors
4. multer - npm i multer
5. mongoose - npm i mongoose

6. Typescript - npm i typescript --save-dev - considered a development library
7. Husky - npx husky-init // npm install husky --save-dev
8. ESLint - npm init @eslint/config - USE JS (import/export) as Typescript uses import/export.

---

ESlint and Prettier:

ESlint Rules: rules:

---

    { "semi": "off", "space-before-function-paren": "off", "quotes": [2, "double"], "quote-props": [2, "consistent"], "multiline-ternary": "off", "comma-dangle": "off", },

Prettier Rules

---

    { "singleQuote": false, "tabWidth": 2, "arrowParens": "always", "proseWrap": "never", "singleAttributePerLine": false, "quoteProps": "consistent", "semi": true, "printWidth": 600 }

---

install @types/mongoose, express, cors etc.

If req, res etc. producing errors in .ts install: npm i @types/express --save-dev

when typing "req" or "res" or other method it can autocomplete. Color variations show strings or functions.

---
