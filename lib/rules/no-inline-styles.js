/**
 * @fileoverview Detects inline styles
 * @author Aaron Greenwald
 */

'use strict';

const util = require('util');
const Components = require('../util/Components');
const styleSheet = require('../util/stylesheet');

const { StyleSheets } = styleSheet;
const { astHelpers } = styleSheet;

function getElementName(node) {
  let n = node;
  while (n.parent) {
    if (n.type === 'JSXOpeningElement') {
      return n.name.name;
    }
    n = n.parent;
  }
}

function getLastStyleNode(styleSheetNode) {
  return styleSheetNode.declarations[0].init.arguments[0].properties[0];
}

function getStyleSheetNode(body) {
  try {
    // eslint-disable-next-line prefer-destructuring
    return body.find(
      (node) =>
        node.type === 'VariableDeclaration' &&
        node.declarations[0].id.name === 'styles'
    );
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

function getReplaceMentValues(node) {
  const elementName = getElementName(node);
  const styleName = `${elementName.toLowerCase()}Style`;

  return [node.range, `styles.${styleName}`];
}

function getNewStyleRange(body) {
  const styleSheetDeclration = getStyleSheetNode(body);
  if (styleSheetDeclration) {
    return getLastStyleNode(styleSheetDeclration).range;
  }

  return body[body.length - 1].range;
}

function getNewStyleValue(body, node, expression) {
  const elementName = getElementName(node);
  const styleName = `${elementName.toLowerCase()}Style`;
  const newStyleLine = `${styleName}: ${expression}`;

  const styleSheetDeclration = getStyleSheetNode(body);
  if (styleSheetDeclration) {
    return `,\n  ${newStyleLine}`;
  }

  return (
    '\n\n' +
    'const styles = StyleSheet.create({\n' +
    `  ${newStyleLine},\n` +
    '});'
  );
}

function getNewStyleValues(body, node, expression) {
  return [getNewStyleRange(body), getNewStyleValue(body, node, expression)];
}

module.exports = Components.detect((context) => {
  const styleSheets = new StyleSheets();

  function reportInlineStyles(inlineStyles) {
    if (inlineStyles) {
      inlineStyles.forEach((style) => {
        if (style) {
          const expression = util.inspect(style.expression);

          context.report({
            node: style.node,
            message: 'Inline style: {{expression}}',
            data: { expression },
            suggest: style.node.properties.every(
              (p) =>
                p.value.type === 'Literal' || p.value.type === 'UnaryExpression'
            )
              ? [
                  {
                    desc: 'fix this badboy',
                    fix: function(fixer) {
                      const sourceCode = context.getSourceCode();

                      const [newStyleRange, newStyleValue] = getNewStyleValues(
                        sourceCode.ast.body,
                        style.node,
                        expression
                      );

                      const [
                        replacementRange,
                        replacementValue,
                      ] = getReplaceMentValues(style.node);

                      return [
                        fixer.replaceTextRange(
                          replacementRange,
                          replacementValue
                        ),
                        fixer.insertTextAfterRange(
                          newStyleRange,
                          newStyleValue
                        ),
                      ];
                    },
                  },
                ]
              : [],
          });
        }
      });
    }
  }

  return {
    JSXAttribute: (node) => {
      if (astHelpers.isStyleAttribute(node)) {
        const styles = astHelpers.collectStyleObjectExpressions(
          node.value,
          context
        );
        styleSheets.addObjectExpressions(styles);
      }
    },

    'Program:exit': () =>
      reportInlineStyles(styleSheets.getObjectExpressions()),
  };
});

module.exports.schema = [];
