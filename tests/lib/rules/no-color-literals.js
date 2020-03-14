/**
 * @fileoverview No color literals used in styles
 * @author Aaron Greenwald
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-color-literals');

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const tests = {
  valid: [
    {
      code: `
        const $red = 'red'
        const $blue = 'blue'
        const styles = StyleSheet.create({
            style1: {
                color: $red,
            },
            style2: {
                color: $blue,
            }
        });
        export default class MyComponent extends Component {
            render() {
                const isDanger = true;
                return <View 
                           style={[styles.style1, isDanger ? styles.style1 : styles.style2]}
                       />;
            }
        }
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
            style1: {
                color: $red,
            },
            style2: {
                color: $blue,
            }
        });
        export default class MyComponent extends Component {
            render() {
                const trueColor = '#fff';
                const falseColor = '#000' 
                return <View 
                   style={[style1, 
                           this.state.isDanger && {color: falseColor}, 
                           {color: someBoolean ? trueColor : falseColor }]} 
                        />;
            }
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        const Hello = React.createClass({
          render: function() {
            return <Text style={{backgroundColor: '#FFFFFF', opacity: 0.5}}>
              Hello {this.props.name}
             </Text>;
          }
        });
      `,
      errors: [
        {
          message: "Color literal: { backgroundColor: '#FFFFFF' }",
        },
      ],
    },
    {
      code: `
        const Hello = React.createClass({
          render: function() {
            return <Text style={{backgroundColor: '#FFFFFF', opacity: this.state.opacity}}>
              Hello {this.props.name}
             </Text>;
          }
        });
      `,
      errors: [
        {
          message: "Color literal: { backgroundColor: '#FFFFFF' }",
        },
      ],
    },
    {
      code: `
        const styles = StyleSheet.create({
          text: {fontColor: '#000'}
        })
        const Hello = React.createClass({
          render: function() {
            return <Text style={{opacity: this.state.opacity, height: 12, fontColor: styles.text}}>
              Hello {this.props.name}
             </Text>;
          }
        });
      `,
      errors: [
        {
          message: "Color literal: { fontColor: '#000' }",
        },
      ],
    },
    {
      code: `
        const Hello = React.createClass({
          render: function() {
            return <Text style={[styles.text, {backgroundColor: '#FFFFFF'}]}>
              Hello {this.props.name}
             </Text>;
          }
        });
      `,
      errors: [
        {
          message: "Color literal: { backgroundColor: '#FFFFFF' }",
        },
      ],
    },
    {
      code: `
        const Hello = React.createClass({
          render: function() {
            const someBoolean = false; 
            return <Text style={[styles.text, someBoolean && {backgroundColor: '#FFFFFF'}]}>
              Hello {this.props.name}
             </Text>;
          }
        });
      `,
      errors: [
        {
          message: "Color literal: { backgroundColor: '#FFFFFF' }",
        },
      ],
    },
    {
      code: `
        const styles = StyleSheet.create({
            style1: {
                color: 'red',
            },
            // this is illegal even though it's not used anywhere
            style2: {
                borderBottomColor: 'blue',
            }
        });
        export default class MyComponent extends Component {
            render() {
                return <View 
                   style={[style1, 
                           this.state.isDanger && styles.style1, 
                           {backgroundColor: someBoolean ? '#fff' : '#000'}]} 
                        />;
            }
        }
      `,
      errors: [
        {
          message: "Color literal: { color: 'red' }",
        },
        {
          message: "Color literal: { borderBottomColor: 'blue' }",
        },
        {
          message:
            "Color literal: { backgroundColor: \"someBoolean ? '#fff' : '#000'\" }",
        },
      ],
    },
  ],
};

const config = {
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaFeatures: {
      classes: true,
      jsx: true,
    },
  },
};

tests.valid.forEach((t) => Object.assign(t, config));
tests.invalid.forEach((t) => Object.assign(t, config));

ruleTester.run('no-color-literals', rule, tests);
