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
          const message = [
            'Unused style detected: ',
            key,
            '.',
            node.key.name,
          ].join('');

          context.report(node, message);
        });
      }
    });
  }

  const segmentContexts = [];
  return {
    JSXOpeningElement: function (node) {
      if (node.name.name === 'SegmentPicker') {
        const possibleStylesheetNames = node.attributes.map(
          attr => (((attr || {}).value || {}).expression || {}).name
        );
        if (possibleStylesheetNames.some(astHelpers.isStyleSheetName)) {
          const expression = node.parent.children.find(n => n.type === 'JSXExpressionContainer')
            .expression;
          const parameterName = expression.params[0].name;
          segmentContexts.push({
            parameterName,
            stylesheetNames: possibleStylesheetNames,
            isStyleSegmentPicker: true,
          });
        } else {
          segmentContexts.push({
            isStyleSegmentPicker: false,
          });
        }
      }
    },

    JSXClosingElement: function (node) {
      if (node.name.name === 'SegmentPicker' && segmentContexts.length > 0) {
        segmentContexts.pop();
      }
    },

    MemberExpression: function (node) {
      const isPotentialStyleRef = astHelpers.isNodePotentialStyleReferenceFromMemberExpression(
        node
      );
      if (isPotentialStyleRef) {
        const baseRef = [node.object.name, node.property.name].join('.');
        if (segmentContexts.length > 0) {
          // This block resolves the cases in which the ref is found inside a SegmentPicker block
          // It adds the original style declaration ref when we find
          const styleRefs = [];
          segmentContexts.forEach((context) => {
            if (context.isStyleSegmentPicker && node.object.name === context.parameterName) {
              context.stylesheetNames.forEach((stylesheetName) => {
                styleRefs.push([stylesheetName, node.property.name].join('.'));
              });
            }
          });
          if (styleRefs.length === 0) {
            styleRefs.push(baseRef);
          }
          styleRefs.forEach((styleRef) => styleReferences.add(styleRef));
        } else {
          // This block resolves the cases where we are not inside a SegmentPicker block
          styleReferences.add(baseRef);
        }
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
