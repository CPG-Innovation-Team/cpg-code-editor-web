module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/src/assets'],
  transformIgnorePatterns: ['/node_modules/(?!monaco-editor)'],
  moduleNameMapper: {
    'monaco-editor': '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.api.js',
  },
  setupFiles: ['fake-indexeddb/auto', './tests/unit/setup.js'],
};
