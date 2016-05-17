'use strict'

module.exports = {
  rules: {
    'no-unused-styles': require('./lib/rules/no-unused-styles'),
    'no-inline-styles': require('./lib/rules/no-inline-styles'),
    'no-color-literals': require('./lib/rules/no-color-literals'),
    'split-platform-components': require('./lib/rules/split-platform-components')
  },
  rulesConfig: {
    'no-unused-styles': 0,
    'no-inline-styles': 0,
    'no-color-literals': 0,
    'split-platform-components': 0
  }
};
