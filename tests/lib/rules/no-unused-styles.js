/**
 * @fileoverview No unused styles defined in javascript files
 * @author Tom Hastjarjanto
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-unused-styles');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-unused-styles', rule, {

  valid: [{
    code: [
      'const styles = StyleSheet.create({',
      '  name: {}',
      '});',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <Text style={styles.name}>Hello {this.props.name}</Text>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  name: {},',
      '  welcome: {}',
      '});',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <Text style={styles.name}>Hello {this.props.name}</Text>;',
      '  }',
      '});',
      'const Welcome = React.createClass({',
      '  render: function() {',
      '    return <Text style={styles.welcome}>Welcome</Text>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  text: {}',
      '})',
      'const Hello = React.createClass({',
      '  propTypes: {',
      '    textStyle: Text.propTypes.style,',
      '  },',
      '  render: function() {',
      '    return <Text style={[styles.text, textStyle]}>Hello {this.props.name}</Text>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  text: {}',
      '})',
      'const styles2 = StyleSheet.create({',
      '  text: {}',
      '})',
      'const Hello = React.createClass({',
      '  propTypes: {',
      '    textStyle: Text.propTypes.style,',
      '  },',
      '  render: function() {',
      '    return <Text style={[styles.text, styles2.text, textStyle]}>Hello {this.props.name}</Text>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  text: {}',
      '})',
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'const styles = StyleSheet.create({',
      '  text: {}',
      '})',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <Text style={styles.b}>Hello {this.props.name}</Text>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: [{
      message: 'Unused style detected: styles.text'
    }]
  }
]});
