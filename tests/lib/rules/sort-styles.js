/**
 * @fileoverview Require StyleSheet object keys to be sorted
 * @author Mats Byrkjeland
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/sort-styles');

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
          a: {},
          b: {},
          c: {},
        });
      `,
    },
    {
      code: `
        const styles = {
          c: {},
          b: {},
          a: {},
        }
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
            z: 3,
          },
        })
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
          },
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
    },
    {
      code: `
        const styles = StyleSheet.create({
          b: {
            y: 1,
            x: 2,
          },
          a: {
            b: 1,
            a: 2,
          },
        })
      `,
      options: ['desc'],
    },
    {
      code: `
        const styles = StyleSheet.create({
          b: {
            y: 1,
            x: 2,
          },
          a: {
            b: 1,
            a: 2,
          },
        })
      `,
      options: ['asc', { ignoreClassNames: true, ignoreStyleProperties: true }],
    },
    {
      code: `
        const styles = StyleSheet.create({
          headerWrapper: {
              backgroundColor: COLORS.WHITE,
              marginTop: -350,
              padding: UNITS.BASE_UNIT * 3,
              paddingTop: 375,
          },
          bodyWrapper: {
              padding: UNITS.BASE_UNIT * 3,
          },
          voidMessageWrapper: {
              marginTop: 20,
          },
          headerMeta: {
              paddingBottom: 10,
              paddingTop: 20,
          },
          bigText: {
              fontSize: 22,
              fontWeight: '600',
          },
        })
      `,
      options: ['asc', { ignoreClassNames: true }],
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
            ...c,
            a: 1,
            c: 2,
            ...g,
            b: 5,
          },
          c: {},
          ...g,
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
    },
    {
      code: `
      const styles = StyleSheet.create({
        a: {
          margin: 1,
          marginLeft: 1,
        },
        b: {
          border: 1,
          borderLeft: 1,
        },
        c: {
          padding: 1,
          paddingLeft: 1,
        },
        d: {
          flex: 1,
          flexGrow: 1,
        }
      })
      `,
      options: ['asc'],
    },
    {
      code: `
      const styles = StyleSheet.create({
        d: {
          marginLeft: 1,
          margin: 1,
        },
        c: {
          border: 1,
          borderLeft: 1,
        },
        b: {
          padding: 1,
          paddingLeft: 1,
        },
        a: {
          flex: 1,
          flexGrow: 1,
        }
      })
      `,
      options: ['desc'],
    },
  ],
  invalid: [
    {
      code: `
          const styles = StyleSheet.create({
            myClass: {
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'red',
            },
          })
          `,
      output: `
          const styles = StyleSheet.create({
            myClass: {
              backgroundColor: 'red',
              flex: 1,
              flexDirection: 'row',
            },
          })
          `,
      errors: [
        {
          message:
            "Expected style properties to be in ascending order. 'backgroundColor' should be before 'flexDirection'.",
        },
      ],
    },
    {
      code: `
          const styles = StyleSheet.create({
            myClass: {
              y: 2,
              x: 1,
              z: 3,
            },
          })
          `,
      output: `
          const styles = StyleSheet.create({
            myClass: {
              x: 1,
              y: 2,
              z: 3,
            },
          })
          `,
      errors: [
        {
          message:
            "Expected style properties to be in ascending order. 'x' should be before 'y'.",
        },
      ],
    },
    {
      code: `
          const styles = StyleSheet.create({
            b: {
              x: 1,
              y: 2,
            },
            a: {
              a: 1,
              b: 2,
            },
          })
        `,
      output: `
          const styles = StyleSheet.create({
            a: {
              a: 1,
              b: 2,
            },
            b: {
              x: 1,
              y: 2,
            },
          })
        `,
      errors: [
        {
          message:
            "Expected class names to be in ascending order. 'a' should be before 'b'.",
        },
      ],
    },
    {
      code: `
          const styles = StyleSheet.create({
            'd': {},
            'c': {},
            'a': {},
            'e': {},
            'b': {},
          })
        `,

      output: `
          const styles = StyleSheet.create({
            'a': {},
            'b': {},
            'c': {},
            'd': {},
            'e': {},
          })
        `,
      errors: [
        {
          message:
            "Expected class names to be in ascending order. 'c' should be before 'd'.",
        },
      ],
    },
    {
      code: `
          const styles = StyleSheet.create({
            ['b']: {},
            [\`a\`]: {},
          })
        `,
      output: `
          const styles = StyleSheet.create({
            [\`a\`]: {},
            ['b']: {},
          })
        `,
      errors: [
        {
          message:
            "Expected class names to be in ascending order. 'a' should be before 'b'.",
        },
      ],
    },
    {
      code: `
          const a = 'a';
          const b = 'b';
          const styles = StyleSheet.create({
            [\`\${a}-\${b}-b\`]: {},
            [\`a-\${b}-a\`]: {},
          })
        `,
      output: `
          const a = 'a';
          const b = 'b';
          const styles = StyleSheet.create({
            [\`a-\${b}-a\`]: {},
            [\`\${a}-\${b}-b\`]: {},
          })
        `,
      errors: [
        {
          message:
            "Expected class names to be in ascending order. 'a-b-a' should be before 'a-b-b'.",
        },
      ],
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            y: 2,
            x: 1,
            ...c,
            d: 3,
            c: 2,
            a: 1,
            ...g,
            b: 5,
          },
          d: {},
          c: {},
          ...g,
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
      output: `
        const styles = StyleSheet.create({
          a: {
            x: 1,
            y: 2,
            ...c,
            a: 1,
            c: 2,
            d: 3,
            ...g,
            b: 5,
          },
          c: {},
          d: {},
          ...g,
          b: {
            a: 1,
            b: 2,
          },
        })
      `,
      errors: [
        {
          message:
            "Expected style properties to be in ascending order. 'x' should be before 'y'.",
        },
        {
          message:
            "Expected style properties to be in ascending order. 'c' should be before 'd'.",
        },
        {
          message:
            "Expected class names to be in ascending order. 'c' should be before 'd'.",
        },
      ],
    },
    {
      code: `
        const styles = StyleSheet.create({
          a: {
            d: 4,
            // comments 1
            c: 3,
            a: 1,
            b: 2,
          },
          d: {},
          c: {},
          // comments 2
          b: {
            a: 1,
            b: 2,
          },
          // comments 3
        })
      `,
      output: `
        const styles = StyleSheet.create({
          a: {
            d: 4,
            // comments 1
            c: 3,
            a: 1,
            b: 2,
          },
          d: {},
          c: {},
          // comments 2
          b: {
            a: 1,
            b: 2,
          },
          // comments 3
        })
      `,
      errors: [
        {
          message:
            "Expected style properties to be in ascending order. 'c' should be before 'd'.",
        },
        {
          message:
            "Expected class names to be in ascending order. 'c' should be before 'd'.",
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        a: {
          z: 1,
          margin: 1,
          b: 1,
          marginLeft: 1,
          a: 1,
        },
        b: {
          z: 1,
          b: 1,
          border: 1,
          borderLeft: 1,
          a: 1,
        },
        c: {
          z: 1,
          padding: 1,
          paddingLeft: 1,
          b: 1,
          a: 1,
        },
        d: {
          flex: 1,
          z: 1,
          b: 1,
          flexGrow: 1,
          a: 1,
        }
      })
      `,
      output: `
      const styles = StyleSheet.create({
        a: {
          a: 1,
          b: 1,
          margin: 1,
          marginLeft: 1,
          z: 1,
        },
        b: {
          a: 1,
          b: 1,
          border: 1,
          borderLeft: 1,
          z: 1,
        },
        c: {
          a: 1,
          b: 1,
          padding: 1,
          paddingLeft: 1,
          z: 1,
        },
        d: {
          a: 1,
          b: 1,
          flex: 1,
          flexGrow: 1,
          z: 1,
        }
      })
      `,
      options: ['asc'],
      errors: [
        {
          message:
            "Expected style properties to be in ascending order. 'margin' should be before 'z'.",
        },
        {
          message:
            "Expected style properties to be in ascending order. 'b' should be before 'z'.",
        },
        {
          message:
            "Expected style properties to be in ascending order. 'padding' should be before 'z'.",
        },
        {
          message:
            "Expected style properties to be in ascending order. 'b' should be before 'z'.",
        },
      ],
    },
    {
      code: `
      const styles = StyleSheet.create({
        d: {
          a: 1,
          marginLeft: 1,
          b: 1,
          margin: 1,
          z: 1,
        },
        c: {
          a: 1,
          b: 1,
          border: 1,
          borderLeft: 1,
          z: 1,
        },
        b: {
          a: 1,
          padding: 1,
          paddingLeft: 1,
          b: 1,
          z: 1,
        },
        a: {
          flex: 1,
          a: 1,
          b: 1,
          flexGrow: 1,
          z: 1,
        }
      })
      `,
      output: `
      const styles = StyleSheet.create({
        d: {
          z: 1,
          marginLeft: 1,
          margin: 1,
          b: 1,
          a: 1,
        },
        c: {
          z: 1,
          border: 1,
          borderLeft: 1,
          b: 1,
          a: 1,
        },
        b: {
          z: 1,
          padding: 1,
          paddingLeft: 1,
          b: 1,
          a: 1,
        },
        a: {
          z: 1,
          flex: 1,
          flexGrow: 1,
          b: 1,
          a: 1,
        }
      })
      `,
      options: ['desc'],
      errors: [
        {
          message:
            "Expected style properties to be in descending order. 'marginLeft' should be before 'a'.",
        },
        {
          message:
            "Expected style properties to be in descending order. 'b' should be before 'a'.",
        },
        {
          message:
            "Expected style properties to be in descending order. 'padding' should be before 'a'.",
        },
        {
          message:
            "Expected style properties to be in descending order. 'b' should be before 'a'.",
        },
      ],
    },
    {
      code: `
        StyleSheet.create({
          myClass: {
            y: 2,
            x: 1,
            z: 3,
          },
        })
        `,
      errors: [{
        message: 'Expected style properties to be in ascending order. \'x\' should be before \'y\'.',
      }],
    },
    {
      code: `
        export default StyleSheet.create({
          myClass: {
            y: 2,
            x: 1,
            z: 3,
          },
        })
        `,
      errors: [{
        message: 'Expected style properties to be in ascending order. \'x\' should be before \'y\'.',
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
  settings: {
    'react-native/style-sheet-object-names': ['StyleSheet', 'OtherStyleSheet'],
  },
};

tests.valid.forEach((t) => Object.assign(t, config));
tests.invalid.forEach((t) => Object.assign(t, config));

ruleTester.run('sort-styles', rule, tests);
