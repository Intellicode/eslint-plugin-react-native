/**
 * @fileoverview Detects raw text outside of Text component
 * @author Alex Zhukov
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-raw-text');

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const tests = {
  valid: [
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View><Text>some text</Text></View>);
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View><Text style={{color: 'red'}}>some text</Text></View>);
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            const text = 'some text';
            return (<View><Text>{\`\${text}\`}</Text></View>);
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View><Text>{'some text'}</Text></View>);
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (
              <View>
                <Text>some text</Text>
              </View>
            );
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (
              <Svg>
                <Text>
                  <TSpan>some text</TSpan>
                </Text>
              </Svg>
            );
          }
        }
      `,
    },
    {
      code: `
        const StyledText = styled.Text\`
          color: red;
        \`
        export default class MyComponent extends Component {
          render() {
            return (<StyledText>some text</StyledText>);
          }
        }
      `,
    },
    {
      code: `
        const Title = ({ children }) => (<Text>{children}</Text>);
        <Title>This is the title</Title>
      `,
      options: [{ skip: ['Title'] }],
    },
    {
      code: `
        const Title = ({ children }) => (<Title.Text>{children}</Title.Text>);
        Title.Text = ({ children }) => (<Text>{children}</Text>);
        <Title.Text>This is the title</Title.Text>
      `,
      options: [{ skip: ['Title.Text'] }],
    },
  ],
  invalid: [
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View>some text</View>);
          }
        }
      `,
      errors: [{
        message: 'Raw text (some text) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            const text = 'some text';
            return (<View>{\`\${text}\`}</View>);
          }
        }
      `,
      errors: [{
        message: 'Raw text (TemplateLiteral: text) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View>{'some text'}</View>);
          }
        }
      `,
      errors: [{
        message: 'Raw text (some text) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View>  </View>);
          }
        }
      `,
      errors: [{
        message: 'Whitespace(s) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        const Component = ({ children }) => (<Text>{children}</Text>);
        <Component>some text</Component>
      `,
      options: [{ skip: ['Title'] }],
      errors: [{
        message: 'Raw text (some text) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        const Component = ({ children }) => (<Text>{children}</Text>);
        <Component>some text</Component>
      `,
      options: [{ skip: ['Component.Text'] }],
      errors: [{
        message: 'Raw text (some text) cannot be used outside of a <Text> tag',
      }],
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

const TSConfig = {
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};

tests.valid.forEach((t) => Object.assign(t, config));
tests.invalid.forEach((t) => Object.assign(t, config));

ruleTester.run('no-raw-text', rule, tests);

tests.valid.forEach((t) => Object.assign(t, TSConfig));
tests.invalid.forEach((t) => Object.assign(t, TSConfig));

ruleTester.run('no-raw-text', rule, tests);
