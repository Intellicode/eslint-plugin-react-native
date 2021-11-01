/**
 * @fileoverview No unused styles defined in javascript files
 * @author Tom Hastjarjanto
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-unused-styles');

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
        name: {}
      });
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        name: {}
      });
      const Hello = React.createClass({
        render: function() {
          const { name } = styles;
          return <Text textStyle={name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const Hello = React.createClass({
        render: function() {
          const { name } = styles;
          return <Text textStyle={name}>Hello {this.props.name}</Text>;
        }
      });
      const styles = StyleSheet.create({
        name: {}
      });
    `,
    },
    {
      code: `
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
      const styles = StyleSheet.create({
        name: {}
      });
    `,
    },
    {
      code: `
      const Hello = React.createClass({
        render: function() {
          const { name } = styles;
          return <Text textStyle={name}>Hello {this.props.name}</Text>;
        }
      });
      const styles = StyleSheet.create({
        name: {}
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        name: {}
      });
      const Hello = React.createClass({
        render: function() {
          return <Text style={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        name: {}
      });
      const Hello = React.createClass({
        render: function() {
          const { name } = styles;
          return <Text style={name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        name: {},
        welcome: {}
      });
      const Hello = React.createClass({
        render: function() {
          return <Text style={styles.name}>Hello {this.props.name}</Text>;
        }
      });
      const Welcome = React.createClass({
        render: function() {
          return <Text style={styles.welcome}>Welcome</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        name: {},
        welcome: {}
      });
      const Hello = React.createClass({
        render: function() {
          const { name } = styles;
          return <Text style={name}>Hello {this.props.name}</Text>;
        }
      });
      const Welcome = React.createClass({
        render: function() {
          const { welcome } = styles;
          return <Text style={welcome}>Welcome</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        propTypes: {
          textStyle: Text.propTypes.style,
        },
        render: function() {
          return <Text style={[styles.text, textStyle]}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        propTypes: {
          textStyle: Text.propTypes.style,
        },
        render: function() {
          const { text } = styles;
          return <Text style={[text, textStyle]}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const styles2 = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        propTypes: {
          textStyle: Text.propTypes.style,
        },
        render: function() {
          return (
            <Text style={[styles.text, styles2.text, textStyle]}>
             Hello {this.props.name}
            </Text>
           );
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const styles2 = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        propTypes: {
          textStyle: Text.propTypes.style,
        },
        render: function() {
          const { text } = styles;
          const { text: text2 } = styles2;
          return (
            <Text style={[text, text2, textStyle]}>
             Hello {this.props.name}
            </Text>
           );
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      });
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true, condition2: true };
        },
        render: function() {
          return (
            <Text
              style={[
                this.state.condition &&
                this.state.condition2 &&
                styles.text]}>
              Hello {this.props.name}
            </Text>
          );
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      });
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true, condition2: true };
        },
        render: function() {
          const { text } = styles;
          return (
            <Text
              style={[
                this.state.condition &&
                this.state.condition2 &&
                text]}>
              Hello {this.props.name}
            </Text>
          );
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {},
        text2: {},
      });
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true };
        },
        render: function() {
          return (
            <Text style={[this.state.condition ? styles.text : styles.text2]}>
              Hello {this.props.name}
            </Text>
          );
        }
      });
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {},
        text2: {},
      });
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true };
        },
        render: function() {
          const { text, text2 } = styles;
          return (
            <Text style={[this.state.condition ? text : text2]}>
              Hello {this.props.name}
            </Text>
          );
        }
      });
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
          static propTypes = {
              isDanger: PropTypes.bool
          };
          render() {
            const { style1, style2 } = styles;
              return <View style={this.props.isDanger ? style1 : style2} />;
          }
      }
    `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
    `,
    },
    {
      code: `
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true };
        },
        render: function() {
          const myStyle = this.state.condition ? styles.text : styles.text2;
          return (
              <Text style={myStyle}>
                  Hello {this.props.name}
              </Text>
          );
        }
      });
      const styles = StyleSheet.create({
        text: {},
        text2: {},
      });
    `,
    },
    {
      code: `
      const Hello = React.createClass({
        getInitialState: function() {
          return { condition: true };
        },
        render: function() {
          const { text, text2 } = styles;
          const myStyle = this.state.condition ? text : text2;
          return (
              <Text style={myStyle}>
                  Hello {this.props.name}
              </Text>
          );
        }
      });
      const styles = StyleSheet.create({
        text: {},
        text2: {},
      });
    `,
    },
    {
      code: `
      const additionalStyles = {};
      const styles = StyleSheet.create({
        name: {},
        ...additionalStyles
      });
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const additionalStyles = {};
      const styles = StyleSheet.create({
        name: {},
        ...additionalStyles
      });
      const Hello = React.createClass({
        render: function() {
          const { name } = styles;
          return <Text textStyle={name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = OtherStyleSheet.create({
        name: {},
      });
      const Hello = React.createClass({
        render: function() {
          return <Text textStyle={styles.name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
    {
      code: `
      const styles = OtherStyleSheet.create({
        name: {},
      });
      const Hello = React.createClass({
        render: function() {
          const { name } = styles;
          return <Text textStyle={name}>Hello {this.props.name}</Text>;
        }
      });
    `,
    },
  ],

  invalid: [
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        render: function() {
          return <Text style={styles.b}>Hello {this.props.name}</Text>;
        }
      });
    `,
      errors: [
        {
          message: 'Unused style detected: styles.text',
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = React.createClass({
        render: function() {
          const { b } = styles;
          return <Text style={b}>Hello {this.props.name}</Text>;
        }
      });
    `,
      errors: [
        {
          message: 'Unused style detected: styles.text',
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.Component {
        render() {
          return <View style={styles.foo}/>;
        }
      }
    `,
      errors: [
        {
          message: 'Unused style detected: styles.bar',
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.Component {
        render() {
          const { foo } = styles;
          return <View style={foo}/>;
        }
      }
    `,
      errors: [
        {
          message: 'Unused style detected: styles.bar',
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.PureComponent {
        render() {
          return <View style={styles.foo}/>;
        }
      }
    `,
      errors: [
        {
          message: 'Unused style detected: styles.bar',
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.PureComponent {
        render() {
          const { foo } = styles;
          return <View style={foo}/>;
        }
      }
    `,
      errors: [
        {
          message: 'Unused style detected: styles.bar',
        },
      ],
    },
    {
      code: `
      const styles = OtherStyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.PureComponent {
        render() {
          return <View style={styles.foo}/>;
        }
      }
    `,
      errors: [
        {
          message: 'Unused style detected: styles.bar',
        },
      ],
    },
    {
      code: `
      const styles = OtherStyleSheet.create({
        foo: {},
        bar: {},
      })
      class Foo extends React.PureComponent {
        render() {
          const { foo } = styles;
          return <View style={foo}/>;
        }
      }
    `,
      errors: [
        {
          message: 'Unused style detected: styles.bar',
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = () => (<><Text style={styles.b}>Hello</Text></>);
    `,
      errors: [
        {
          message: 'Unused style detected: styles.text',
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        text: {}
      })
      const Hello = () => {
        const { b } = styles;
        return <><Text style={styles.b}>Hello</Text></>;
      }
    `,
      errors: [
        {
          message: 'Unused style detected: styles.text',
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
  settings: {
    'react-native/style-sheet-object-names': ['StyleSheet', 'OtherStyleSheet'],
  },
};

tests.valid.forEach((t) => Object.assign(t, config));
tests.invalid.forEach((t) => Object.assign(t, config));

ruleTester.run('no-unused-styles', rule, tests);
