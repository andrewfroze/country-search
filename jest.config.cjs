const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  transform: tsJestTransformCfg,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
};
