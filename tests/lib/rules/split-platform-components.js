/**
 * @fileoverview Android and IOS components should be
 * used in platform specific React Native components.
 * @author Tom Hastjarjanto
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/split-platform-components');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const tests = {
  valid: [{
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  ActivityIndicatiorIOS,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ActivityIndicatiorIOS />;',
      '  }',
      '});',
    ].join('\n'),
    filename: 'Hello.ios.js',
  }, {
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  ProgressBarAndroid,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ProgressBarAndroid />;',
      '  }',
      '});',
    ].join('\n'),
    filename: 'Hello.android.js',
  }, {
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  View,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <View />;',
      '  }',
      '});',
    ].join('\n'),
    filename: 'Hello.js',
  }, {
    code: [
      'import {',
      '  ActivityIndicatiorIOS,',
      '} from \'react-native\'',
    ].join('\n'),
    filename: 'Hello.ios.js',
  }, {
    code: [
      'import {',
      '  ProgressBarAndroid,',
      '} from \'react-native\'',
    ].join('\n'),
    filename: 'Hello.android.js',
  }, {
    code: [
      'import {',
      '  View,',
      '} from \'react-native\'',
    ].join('\n'),
    filename: 'Hello.js',
  }, {
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  ActivityIndicatiorIOS,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ActivityIndicatiorIOS />;',
      '  }',
      '});',
    ].join('\n'),
    options: [{
      iosPathRegex: '\\.ios(\\.test)?\\.js$',
    }],
    filename: 'Hello.ios.test.js',
  }, {
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  ProgressBarAndroid,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ProgressBarAndroid />;',
      '  }',
      '});',
    ].join('\n'),
    options: [{
      androidPathRegex: '\\.android(\\.test)?\\.js$',
    }],
    filename: 'Hello.android.test.js',
  }],

  invalid: [{
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  ProgressBarAndroid,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ProgressBarAndroid />;',
      '  }',
      '});',
    ].join('\n'),
    filename: 'Hello.js',
    errors: [{
      message: 'Android components should be placed in android files',
    }],
  }, {
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  ActivityIndicatiorIOS,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ActivityIndicatiorIOS />;',
      '  }',
      '});',
    ].join('\n'),
    filename: 'Hello.js',
    errors: [{
      message: 'IOS components should be placed in ios files',
    }],
  }, {
    code: [
      'const React = require(\'react-native\');',
      'const {',
      '  ActivityIndicatiorIOS,',
      '  ProgressBarAndroid,',
      '} = React',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <ActivityIndicatiorIOS />;',
      '  }',
      '});',
    ].join('\n'),
    filename: 'Hello.js',
    errors: [{
      message: 'IOS and Android components can\'t be mixed',
    }, {
      message: 'IOS and Android components can\'t be mixed',
    }],
  }, {
    code: [
      'import {',
      '  ProgressBarAndroid,',
      '} from \'react-native\'',
    ].join('\n'),
    filename: 'Hello.js',
    errors: [{
      message: 'Android components should be placed in android files',
    }],
  }, {
    code: [
      'import {',
      '  ActivityIndicatiorIOS,',
      '} from \'react-native\'',
    ].join('\n'),
    filename: 'Hello.js',
    errors: [{
      message: 'IOS components should be placed in ios files',
    }],
  }, {
    code: [
      'import {',
      '  ActivityIndicatiorIOS,',
      '  ProgressBarAndroid,',
      '} from \'react-native\'',
    ].join('\n'),
    filename: 'Hello.js',
    errors: [{
      message: 'IOS and Android components can\'t be mixed',
    }, {
      message: 'IOS and Android components can\'t be mixed',
    }],
  }],
};

const config = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      classes: true,
      jsx: true,
    },
  },
};

tests.valid.forEach(t => Object.assign(t, config));
tests.invalid.forEach(t => Object.assign(t, config));

ruleTester.run('split-platform-components', rule, tests);
