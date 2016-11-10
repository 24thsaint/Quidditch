module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import"
  ],
  "parser": "babel-eslint",
  "rules": {
    "semi": [
      "error",
      "never"
    ],
    "import/no-extraneous-dependencies": [
      2, { "devDependencies": true }
    ]
  }
};
