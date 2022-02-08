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

module.exports = Components.detect((context) => {
  const options = context.options[0] || {};
  const styleSheets = new StyleSheets();

  function reportInlineStyles(inlineStyles) {
    if (inlineStyles) {
      inlineStyles.forEach((style) => {
        if (style) {
          const lengthLimit = options.allowStylePropertiesLessThan
          if (lengthLimit && Object.keys(style.expression).length < lengthLimit)
            return;
          const expression = util.inspect(style.expression);
          context.report({
            node: style.node,
            message: 'Inline style: {{expression}}',
            data: { expression },
          });
        }
      });
    }
  }

  return {
    JSXAttribute: (node) => {
      if (astHelpers.isStyleAttribute(node)) {
        const styles = astHelpers.collectStyleObjectExpressions(node.value, context);
        styleSheets.addObjectExpressions(styles);
      }
    },

    'Program:exit': () => reportInlineStyles(styleSheets.getObjectExpressions()),
  };
});

module.exports.schema = [
  {
    type: 'object',
    properties: {
      allowStylePropertiesLessThan: {
        type: 'number',
      },
    },
  },
];
