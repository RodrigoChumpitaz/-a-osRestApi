module.exports = {
    "roots": [
      "./src"
    ],
    "setupFilesAfterEnv": ['./src/__test__/local.test.ts'],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "testEnvironment": "node",
    "preset": "ts-jest",
}