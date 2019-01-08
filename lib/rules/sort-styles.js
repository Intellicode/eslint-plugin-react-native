/**
 * @fileoverview Rule to require StyleSheet object keys to be sorted
 * @author Mats Byrkjeland
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { astHelpers } = require('../util/stylesheet');

const { getStyleDeclarations, isStyleSheetDeclaration } = astHelpers;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = (context) => {
  const order = context.options[0] || 'asc';
  const options = context.options[1] || {};
  const ignoreClassNames = options.ignoreClassNames;
  const ignoreStyleProperties = options.ignoreStyleProperties;
  const isValidOrder = order === 'asc' ? (a, b) => a <= b : (a, b) => a >= b;

  function report(type, node, prev, current) {
    const currentName = current.key.name;
    const prevName = prev.key.name;
    context.report({
      node,
      message: `Expected ${type} to be in ${order}ending order. '${currentName}' should be before '${prevName}'.`,
      loc: current.key.loc,
    });
  }

  function checkIsSorted(array, arrayName, node) {
    for (let i = 1; i < array.length; i += 1) {
      const previous = array[i - 1];
      const current = array[i];

      if (previous.type !== 'Property' || current.type !== 'Property') {
        return;
      }

      if (!isValidOrder(previous.key.name, current.key.name)) {
        return report(arrayName, node, previous, current);
      }
    }
  }

  return {
    VariableDeclarator: function (node) {
      if (!isStyleSheetDeclaration(node, context.settings)) {
        return;
      }

      const classDefinitions = getStyleDeclarations(node);

      if (!ignoreClassNames) {
        checkIsSorted(classDefinitions, 'class names', node);
      }

      if (ignoreStyleProperties) return;

      classDefinitions.forEach((classDefinition) => {
        const styleProperties = classDefinition.value.properties;
        if (!styleProperties || styleProperties.length < 2) {
          return;
        }

        checkIsSorted(styleProperties, 'style properties', node);
      });
    },
  };
};

module.exports.schema = [
  {
    enum: ['asc', 'desc'],
  },
  {
    type: 'object',
    properties: {
      ignoreClassNames: {
        type: 'boolean',
      },
      ignoreStyleProperties: {
        type: 'boolean',
      },
    },
    additionalProperties: false,
  },
];
