/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */

const config = {
  "**/*.{js,jsx,ts,tsx}": ["npm run lint:fix"],
  "**/*.{js,jsx,ts,tsx,json,css,md}": ["npm run format"],
};

export default config;
