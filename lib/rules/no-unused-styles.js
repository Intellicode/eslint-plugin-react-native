/**
 * @fileoverview Detects unused styles
 * @author Tom Hastjarjanto
 */

'use strict';

const Components = require('../util/Components');
const styleSheet = require('../util/stylesheet');

const { StyleSheets } = styleSheet;
const { astHelpers } = styleSheet;

module.exports = Components.detect((context, components) => {
  const styleSheets = new StyleSheets();
  const styleReferences = new Set();

  function reportUnusedStyles(unusedStyles) {
    Object.keys(unusedStyles).forEach((key) => {
      if ({}.hasOwnProperty.call(unusedStyles, key)) {
        const styles = unusedStyles[key];
        styles.forEach((node) => {
          const message = ['Unused style detected: ', key, '.', node.key.name].join('');

          context.report(node, message);
        });
      }
    });
  }

  return {
    MemberExpression: function (node) {
      const styleRef = astHelpers.getPotentialStyleReferenceFromMemberExpression(node);
      if (styleRef) {
        styleReferences.add(styleRef);
      }
    },

    ArrayExpression: function (arrayNode) {
      if (arrayNode && arrayNode.elements && arrayNode.elements.length) {
        arrayNode.elements
          .flatMap((node) => {
            const styleRef = astHelpers.getPotentialStyleReferenceFromArrayExpression(node);
            return styleRef ? [styleRef] : [];
          })
          .forEach((styleRef) => {
            styleReferences.add(styleRef);
          });
      }
    },

    JSXExpressionContainer: function (node) {
      const styleRef = astHelpers.getPotentialStyleReferenceFromJSXExpressionContainer(node);
      if (styleRef) {
        styleReferences.add(styleRef);
      }
    },

    CallExpression: function (node) {
      if (astHelpers.isStyleSheetDeclaration(node, context.settings)) {
        const styleSheetName = astHelpers.getStyleSheetName(node);
        const styles = astHelpers.getStyleDeclarations(node);

        styleSheets.add(styleSheetName, styles);
      }
    },

    'Program:exit': function () {
      const list = components.all();
      if (Object.keys(list).length > 0) {
        styleReferences.forEach((reference) => {
          styleSheets.markAsUsed(reference);
        });
        reportUnusedStyles(styleSheets.getUnusedReferences());
      }
    },
  };
});

module.exports.schema = [];
