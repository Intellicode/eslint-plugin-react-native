/**
 * @fileoverview No inline styles defined in javascript files
 * @author Aaron Greenwald
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-inline-styles');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();


const tests = {

  valid: [
    {
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
    },
    {
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
        '    render() {',
        '        const trueColor = \'#fff\'; const falseColor = \'#000\' ',
        '        return <View ',
        '           style={[style1, ',
        '                   this.state.isDanger && styles.style1, ',
        '                   {color: someBoolean ? trueColor : falseColor }]} ',
        '                />;',
        '    }',
        '}',
      ].join('\n'),
    },
  ],
  invalid: [
    {
      code: [
        'const Hello = React.createClass({',
        '  render: function() {',
        '    return <Text style={{backgroundColor: \'#FFFFFF\', opacity: 0.5}}>',
        '      Hello {this.props.name}',
        '     </Text>;',
        '  }',
        '});',
      ].join('\n'),
      errors: [{
        message: 'Inline style: { backgroundColor: \'#FFFFFF\', opacity: 0.5 }',
      }],
    },
    {
      code: [
        'const Hello = React.createClass({',
        '  render: function() {',
        '    return <Text style={{backgroundColor: \'#FFFFFF\', opacity: this.state.opacity}}>',
        '      Hello {this.props.name}',
        '     </Text>;',
        '  }',
        '});',
      ].join('\n'),
      errors: [{
        message: 'Inline style: { backgroundColor: \'#FFFFFF\' }',
      }],
    },
    {
      code: [
        'const Hello = React.createClass({',
        '  render: function() {',
        '    return <Text style={{opacity: this.state.opacity, height: 12}}>',
        '      Hello {this.props.name}',
        '     </Text>;',
        '  }',
        '});',
      ].join('\n'),
      errors: [{
        message: 'Inline style: { height: 12 }',
      }],
    },
    {
      code: [
        'const Hello = React.createClass({',
        '  render: function() {',
        '    return <Text style={[styles.text, {backgroundColor: \'#FFFFFF\'}]}>',
        '      Hello {this.props.name}',
        '     </Text>;',
        '  }',
        '});',
      ].join('\n'),
      errors: [{
        message: 'Inline style: { backgroundColor: \'#FFFFFF\' }',
      }],
    },
    {
      code: [
        'const Hello = React.createClass({',
        '  render: function() {',
        '    const someBoolean = false; ',
        '    return <Text style={[styles.text, someBoolean && {backgroundColor: \'#FFFFFF\'}]}>',
        '      Hello {this.props.name}',
        '     </Text>;',
        '  }',
        '});',
      ].join('\n'),
      errors: [{
        message: 'Inline style: { backgroundColor: \'#FFFFFF\' }',
      }],
    },
    {
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
        '    render() {',
        '        return <View ',
        '           style={[style1, ',
        '                   this.state.isDanger && styles.style1, ',
        '                   {backgroundColor: someBoolean ? \'#fff\' : \'#000\'}]} ',
        '                />;',
        '    }',
        '}',
      ].join('\n'),
      errors: [{
        message: 'Inline style: { backgroundColor: \'someBoolean ? \\\'#fff\\\' : \\\'#000\\\'\' }', //eslint-disable-line
      }],
    },
  ],
};

const config = {
  parser: 'babel-eslint',
  ecmaFeatures: {
    classes: true,
    jsx: true,
  },
};

tests.valid.forEach(t => Object.assign(t, config));
tests.invalid.forEach(t => Object.assign(t, config));

ruleTester.run('no-inline-styles', rule, tests);
