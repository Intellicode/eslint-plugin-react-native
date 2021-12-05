/**
 * @fileoverview Enforce no single element style arrays
 * @author Michael Gall
 */

'use strict';

/* eslint-disable quotes */ // For better readability on tests involving quotes

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-single-element-style-arrays');

require('@babel/eslint-parser');

const unnecessaryArrayMessage = 'Single element style arrays are not necessary and cause unnecessary re-renders';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const config = {
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      parserOpts: {
        plugins: [
          ['estree', { classFeatures: true }],
          'jsx',
        ],
      },
    },
  },
  settings: {
    'react-native/style-sheet-object-names': ['StyleSheet', 'OtherStyleSheet'],
  },
};

const ruleTester = new RuleTester(config);
ruleTester.run('single-element-style-array', rule, {
  valid: [
    {
      code: `
      const Hello = React.createClass({
        render: function() {
          return <App {...props}>foo</App>;
        }
      });
    `,
    },
    {
      code: '<App>foo</App>',
    },
    {
      code: '<App style={woop}>foo</App>',
    },
    {
      code: '<App style={{woop: "woop"}}>foo</App>',
    },
    {
      code: '<App style={[woope, wap]}>foo</App>',
    },
    {
      code: '<App className="asdf" style={woop}>foo</App>',
    },
  ],

  invalid: [
    {
      code: '<App style={[woop]}>foo</App>',
      output: '<App style={woop}>foo</App>',
      errors: [{ message: unnecessaryArrayMessage }],
    },
    {
      code: '<App style={[{woop: "woop"}]}>foo</App>',
      output: '<App style={{woop: "woop"}}>foo</App>',
      errors: [{ message: unnecessaryArrayMessage }],
    },

  ],
});
