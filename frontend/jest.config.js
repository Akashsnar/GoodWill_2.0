// module.exports = {
//     // transform: {
//     //   "^.+\\.[t|j]sx?$": "babel-jest"
//     // },
//     moduleNameMapper: {
//       "\\.(css|less|sass|scss)$": "identity-obj-proxy"
//     },
//     testEnvironment: 'jsdom'
//   };
  
  module.exports = {
    preset: "@vue/cli-plugin-unit-jest",
    moduleFileExtensions: [
      "js",
      "json",
      "vue",
    ],
    transform: {
      "^[^.]+.vue$": "vue-jest",
      "^.+\\.js$": "babel-jest",
    },
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(spec|test).[jt]s?(x)",
    ],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
    collectCoverage: false,
    collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
    testEnvironment: 'jsdom',
  };