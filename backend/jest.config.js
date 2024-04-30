// jest.config.js
module.exports = {
  roots: ["./"],
  collectCoverageFrom: ["./**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  // setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  testMatch: [
    "./**/__tests__/**/*.{js,jsx,ts,tsx}",
    "./**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "./node_modules/babel-jest",
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$"],
  modulePaths: [],
  moduleNameMapper: {
    "^react-native$": "react-native-web",
    "\\.(css|less|scss|sss|styl)$": "./node_modules/jest-css-modules",
  },
  moduleFileExtensions: [
    "web.js",
    "js",
    "json",
    "web.jsx",
    "jsx",
    "node",
    "ts",
    "tsx",
  ],
  // watchPlugins: [
  //   "jest-watch-typeahead/filename",
  //   "jest-watch-typeahead/testname",
  // ],
};
