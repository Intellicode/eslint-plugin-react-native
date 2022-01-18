/* eslint-env mocha */
/* eslint-disable global-require */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const plugin = require('..');

const rules = fs
  .readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map((f) => path.basename(f, '.js'))
  .filter((e) => !(e.endsWith('experimental') || e.endsWith('stable')));

const defaultSettings = {
  'jsx-uses-vars': 1,
};

describe('all rule files should be exported by the plugin', () => {
  rules.forEach((ruleName) => {
    it('should export ' + ruleName, () => {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join('../lib/rules', ruleName)) // eslint-disable-line import/no-dynamic-require
      );
    });

    if ({}.hasOwnProperty.call(defaultSettings, ruleName)) {
      const val = defaultSettings[ruleName];
      it('should configure ' + ruleName + ' to ' + val + ' by default', () => {
        assert.equal(
          plugin.rulesConfig[ruleName],
          val
        );
      });
    } else {
      it('should configure ' + ruleName + ' off by default', () => {
        assert.equal(
          plugin.rulesConfig[ruleName],
          0
        );
      });
    }
  });
});

describe('configurations', () => {
  it('should export a \'all\' configuration', () => {
    assert(plugin.configs.all);
    Object.keys(plugin.configs.all.rules).forEach((configName) => {
      assert.equal(configName.indexOf('react-native/'), 0);
      assert.equal(plugin.configs.all.rules[configName], 2);
    });
    rules.forEach((ruleName) => {
      const inDeprecatedRules = Boolean(plugin.deprecatedRules[ruleName]);
      const inAllConfig = Boolean(plugin.configs.all.rules['react-native/' + ruleName]);
      assert(inDeprecatedRules ^ inAllConfig); // eslint-disable-line no-bitwise
    });
  });
});
