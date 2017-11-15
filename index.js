/* eslint-disable global-require */

'use strict';

const allRules = {
  'no-unused-styles': require('./lib/rules/no-unused-styles'),
  'no-inline-styles': require('./lib/rules/no-inline-styles'),
  'no-color-literals': require('./lib/rules/no-color-literals'),
  'split-platform-components': require('./lib/rules/split-platform-components'),
};

function configureAsError(rules) {
  const result = {};
  for (const key in rules) {
    if (!rules.hasOwnProperty(key)) {
      continue;
    }
    result['react-native/' + key] = 2;
  }
  return result;
}

const allRulesConfig = configureAsError(allRules);

module.exports = {
  deprecatedRules: {},
  rules: allRules,
  rulesConfig: {
    'no-unused-styles': 0,
    'no-inline-styles': 0,
    'no-color-literals': 0,
    'split-platform-components': 0,
  },
  environments: {
    'react-native': {
      globals: {
        __DEV__: true,
        __dirname: false,
        __fbBatchedBridgeConfig: false,
        alert: false,
        cancelAnimationFrame: false,
        cancelIdleCallback: false,
        clearImmediate: true,
        clearInterval: false,
        clearTimeout: false,
        console: false,
        document: false,
        escape: false,
        Event: false,
        EventTarget: false,
        exports: false,
        fetch: false,
        FormData: false,
        global: false,
        jest: false,
        Map: true,
        module: false,
        navigator: false,
        process: false,
        Promise: true,
        requestAnimationFrame: true,
        requestIdleCallback: true,
        require: false,
        Set: true,
        setImmediate: true,
        setInterval: false,
        setTimeout: false,
        window: false,
        XMLHttpRequest: false,
        pit: false,
      },
    },
  },
  configs: {
    all: {
      plugins: [
        'react-native',
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: allRulesConfig,
    },
  },
};
