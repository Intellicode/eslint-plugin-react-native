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

  /* The segment context checking is given in the following way:
     1. A SegmentPicker component opening tag is identified. Some informations is going to be
        saved in a stack:
       1.1 Whether the SegmentPicker choice attributes' names contain the word 'style'
       1.2 The attributes names for the segment-specific stylesheets themselves, if 1.1
       1.3 The picker's child function's parameter name, which represent the stylesheets, if 1.1
     2. While navigating the code inside the SegmentPicker, when a member expression is found,
        it is checked against the saved information
       2.1 If the object has the same name as 1.3, an entry for that attribute access is added
           for each of the saved stylesheets' names
       2.2 If not, the original member expression entry is added, using the previous logic
     3. When the SegmentPicker closing tag is identified, it is removed from the stack

     This allows for a functional rule when multiple SegmentPickers are inside each other
  */
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
          const styleRefs = [];
          segmentContexts.forEach((context) => {
            if (context.isStyleSegmentPicker && node.object.name === context.parameterName) {
              context.stylesheetNames.forEach((stylesheetName) => {
                styleRefs.push([stylesheetName, node.property.name].join('.'));
              });
            }
          });
          if (styleRefs.length === 0) {
            // The baseRef expression is only added to the refs list if and only if no segment
            // contexts matches this expression. This will make sure a poorly named child param
            // that matches a global stylesheet does not send a false positive check
            styleRefs.push(baseRef);
          }
          styleRefs.forEach((styleRef) => styleReferences.add(styleRef));
        } else {
          // This block resolves the cases where we are not inside a SegmentPicker block by
          // simply adding the baseRef to the list
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
