/* eslint-env mocha */
/* eslint-disable global-require */
'use strict';

const plugin = require('..');

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const rules = fs.readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .map((f) => path.basename(f, '.js'));

const defaultSettings = {
  'jsx-uses-vars': 1,
};

describe('all rule files should be exported by the plugin', () => {
  rules.forEach((ruleName) => {
    it('should export ' + ruleName, () => {
      assert.equal(
        plugin.rules[ruleName],
        require(path.join('../lib/rules', ruleName))
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
