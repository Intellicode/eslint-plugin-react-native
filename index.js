'use strict'

module.exports = {
  rules: {
    'no-unused-styles': require('./lib/rules/no-unused-styles'),
    'split-platform-components': require('./lib/rules/split-platform-components')
  },
  rulesConfig: {
    'no-unused-styles': 0,
    'split-platform-components': 0
  }
};
