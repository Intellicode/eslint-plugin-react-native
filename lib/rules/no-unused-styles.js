/**
 * @fileoverview Detects unused styles
 * @author Tom Hastjarjanto
 */
'use strict';
const Components = require('../util/Components');
const styleSheet = require('../util/stylesheet');
const StyleSheets = styleSheet.StyleSheets;
const astHelpers = styleSheet.astHelpers;

module.exports = Components.detect((context, components) => {
  const styleSheets = new StyleSheets();
  const styleReferences = new Set();

  function reportUnusedStyles(unusedStyles) {
    for (const key in unusedStyles) {
      if (unusedStyles.hasOwnProperty(key)) {
        const styles = unusedStyles[key];
        styles.forEach((node) => {
          const message = [
            'Unused style detected: ',
            key,
            '.',
            node.key.name,
          ].join('');

          context.report(node, message);
        });
      }
    }
  }

  return {
    VariableDeclarator: function (node) {
      if (astHelpers.isStyleSheetDeclaration(node)) {
        const styleSheetName = astHelpers.getStyleSheetName(node);
        const styles = astHelpers.getStyleDeclarations(node);

        styleSheets.add(styleSheetName, styles);
      }
    },

    JSXAttribute: function (node) {
      if (astHelpers.isStyleAttribute(node)) {
        const styles = astHelpers.collectStyleReferences(node.value);
        styles.forEach((style) => {
          styleReferences.add(style);
        });
      }
    },

    'Program:exit': function () {
      const list = components.list();
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
