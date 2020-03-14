/**
 * @fileoverview No inline styles defined in javascript files
 * @author Aaron Greenwald
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-inline-styles');

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const tests = {
  valid: [
    {
      code: `
        const styles = StyleSheet.create({
            style1: {
                color: 'red',
            },
            style2: {
                color: 'blue',
            }
        });
        export default class MyComponent extends Component {
            static propTypes = {
                isDanger: PropTypes.bool
            };
            render() {
                return <View style={this.props.isDanger ? styles.style1 : styles.style2} />;
            }
        }
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
            style1: {
                color: 'red',
            },
            style2: {
                color: 'blue',
            }
        });
        export default class MyComponent extends Component {
            render() {
                const trueColor = '#fff'; const falseColor = '#000' 
                return <View 
                   style={[style1, 
                           this.state.isDanger && styles.style1, 
                           {color: someBoolean ? trueColor : falseColor }]} 
                        />;
            }
        }
      `,
    },
    {
      code: `
        const Hello = React.createClass({
          render: function() {
            const exampleVar = 10;
            return <Text style={{marginLeft: -exampleVar, height: +examplevar}}>
              Hello {this.props.name}
             </Text>;
          }
        });
      `,
    },
  ],
  invalid: [
    {
      code:
        'const Hello = React.createClass({\n' +
        '  render: function() {\n' +
        "    return <Text style={{backgroundColor: '#FFFFFF', opacity: 0.5}}>\n" +
        '      Hello {this.props.name}\n' +
        '    </Text>;\n' +
        '  }\n' +
        '});',
      errors: [
        {
          message: "Inline style: { backgroundColor: '#FFFFFF', opacity: 0.5 }",
          suggestions: [
            {
              desc: 'fix this badboy',
              output:
                'const Hello = React.createClass({\n' +
                '  render: function() {\n' +
                '    return <Text style={styles.textStyle}>\n' +
                '      Hello {this.props.name}\n' +
                '    </Text>;\n' +
                '  }\n' +
                '});\n' +
                '\n' +
                'const styles = StyleSheet.create({\n' +
                "  textStyle: { backgroundColor: '#FFFFFF', opacity: 0.5 },\n" +
                '});',
            },
          ],
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
          message: "Inline style: { backgroundColor: '#FFFFFF' }",
        },
      ],
    },
    {
      code: `
        const Hello = React.createClass({
          render: function() {
            return <Text style={{opacity: this.state.opacity, height: 12}}>
              Hello {this.props.name}
             </Text>;
          }
        });
      `,
      errors: [
        {
          message: 'Inline style: { height: 12 }',
        },
      ],
    },
    {
      code: `
        const Hello = React.createClass({
          render: function() {
            return <Text style={{marginLeft: -7, height: +12}}>
              Hello {this.props.name}
              </Text>;
          }
        });

        const styles = StyleSheet.create({
          container: { flex:1 }
        });
      `,
      errors: [
        {
          message: 'Inline style: { marginLeft: -7, height: 12 }',
          suggestions: [
            {
              output: `
        const Hello = React.createClass({
          render: function() {
            return <Text style={styles.textStyle}>
              Hello {this.props.name}
              </Text>;
          }
        });

        const styles = StyleSheet.create({
          container: { flex:1 },
  textStyle: { marginLeft: -7, height: 12 }
        });
      `,
            },
          ],
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
          message: "Inline style: { backgroundColor: '#FFFFFF' }",
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
          message: "Inline style: { backgroundColor: '#FFFFFF' }",
        },
      ],
    },
    {
      code: `
        const styles = StyleSheet.create({
            style1: {
                color: 'red',
            },
            style2: {
                color: 'blue',
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
          message:
            "Inline style: { backgroundColor: \"someBoolean ? '#fff' : '#000'\" }",
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

ruleTester.run('no-inline-styles', rule, tests);
