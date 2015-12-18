/**
 * @fileoverview Android and IOS components should be
 * used in platform specific React Native components.
 * @author Tom Hastjarjanto
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/split-platform-components');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unused-styles', rule, {

  valid: [{
    code: [
      'var React = require(\'react-native\');',
      'var {',
      '  ActivityIndicatiorIOS,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ActivityIndicatiorIOS />;',
      '  }',
      '});'
    ].join('\n'),
    filename: 'Hello.ios.js',
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'var React = require(\'react-native\');',
      'var {',
      '  ProgressBarAndroid,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ProgressBarAndroid />;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    filename: 'Hello.android.js',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'var React = require(\'react-native\');',
      'var {',
      '  View,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <View />;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    filename: 'Hello.js',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var React = require(\'react-native\');',
      'var {',
      '  ProgressBarAndroid,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ProgressBarAndroid />;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    filename: 'Hello.js',
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Android components should be placed in android files'
    }]
  }, {
    code: [
      'var React = require(\'react-native\');',
      'var {',
      '  ActivityIndicatiorIOS,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ActivityIndicatiorIOS />;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    filename: 'Hello.js',
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'IOS components should be placed in android files'
    }]
  }, {
    code: [
      'var React = require(\'react-native\');',
      'var {',
      '  ActivityIndicatiorIOS,',
      '  ProgressBarAndroid,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ActivityIndicatiorIOS />;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    filename: 'Hello.js',
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'IOS and Android components can\'t be mixed'
    }]
  }
]});
