module.exports = {
  roots: ['src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // moduleNameMapper: {
  //   '^@common/(.*)': '<rootDir>/src/common/$1',
  //   '^@managers/(.*)': '<rootDir>/src/managers/$1',
  //   '^@modules/(.*)': '<rootDir>/src/modules/$1',
  //   '^@services/(.*)': '<rootDir>/src/services/$1',
  // },
}
