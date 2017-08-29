/**
 * @fileoverview No unused styles defined in javascript files
 * @author Tom Hastjarjanto
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-unused-styles');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const tests = {
  valid: [{
    code: [
      'const styles = StyleSheet.create({',
      '  name: {}',
      '});',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;',
      '  }',
      '});',
    ].join('\n'),
  }, {
    code: [
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;',
      '  }',
      '});',
      'const styles = StyleSheet.create({',
      '  name: {}',
      '});',
    ].join('\n'),
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  name: {}',
      '});',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <Text style={styles.name}>Hello {this.props.name}</Text>;',
      '  }',
      '});',
    ].join('\n'),
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
      '});',
    ].join('\n'),
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
      '});',
    ].join('\n'),
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
      '    return (',
      '      <Text style={[styles.text, styles2.text, textStyle]}>',
      '       Hello {this.props.name}',
      '      </Text>',
      '     );',
      '  }',
      '});',
    ].join('\n'),
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  text: {}',
      '});',
      'const Hello = React.createClass({',
      '  getInitialState: function() {',
      '    return { condition: true, condition2: true }; ',
      '  },',
      '  render: function() {',
      '    return (',
      '      <Text',
      '        style={[',
      '          this.state.condition &&',
      '          this.state.condition2 &&',
      '          styles.text]}>',
      '        Hello {this.props.name}',
      '      </Text>',
      '    );',
      '  }',
      '});',
    ].join('\n'),
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  text: {},',
      '  text2: {},',
      '});',
      'const Hello = React.createClass({',
      '  getInitialState: function() {',
      '    return { condition: true }; ',
      '  },',
      '  render: function() {',
      '    return (',
      '      <Text style={[this.state.condition ? styles.text : styles.text2]}>',
      '        Hello {this.props.name}',
      '      </Text>',
      '    );',
      '  }',
      '});',
    ].join('\n'),
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '    style1: {',
      '        color: \'red\',',
      '    },',
      '    style2: {',
      '        color: \'blue\',',
      '    }',
      '});',
      'export default class MyComponent extends Component {',
      '    static propTypes = {',
      '        isDanger: PropTypes.bool',
      '    };',
      '    render() {',
      '        return <View style={this.props.isDanger ? styles.style1 : styles.style2} />;',
      '    }',
      '}',
    ].join('\n'),
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  text: {}',
      '})',
    ].join('\n'),
  }, {
    code: [
      'const Hello = React.createClass({',
      '  getInitialState: function() {',
      '    return { condition: true }; ',
      '  },',
      '  render: function() {',
      '    const myStyle = this.state.condition ? styles.text : styles.text2;',
      '    return (',
      '        <Text style={myStyle}>',
      '            Hello {this.props.name}',
      '        </Text>',
      '    );',
      '  }',
      '});',
      'const styles = StyleSheet.create({',
      '  text: {},',
      '  text2: {},',
      '});',
    ].join('\n'),
  }, {
    code: [
      'const additionalStyles = {};',
      'const styles = StyleSheet.create({',
      '  name: {},',
      '  ...additionalStyles',
      '});',
      'const Hello = React.createClass({',
      '  render: function() {',
      '    return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;',
      '  }',
      '});',
    ].join('\n'),
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
      '});',
    ].join('\n'),
    errors: [{
      message: 'Unused style detected: styles.text',
    }],
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  foo: {},',
      '  bar: {},',
      '})',
      'class Foo extends React.Component {',
      '  render() {',
      '    return <View style={styles.foo}/>;',
      '  }',
      '}',
    ].join('\n'),
    errors: [{
      message: 'Unused style detected: styles.bar',
    }],
  }, {
    code: [
      'const styles = StyleSheet.create({',
      '  foo: {},',
      '  bar: {},',
      '})',
      'class Foo extends React.PureComponent {',
      '  render() {',
      '    return <View style={styles.foo}/>;',
      '  }',
      '}',
    ].join('\n'),
    errors: [{
      message: 'Unused style detected: styles.bar',
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

ruleTester.run('no-unused-styles', rule, tests);
