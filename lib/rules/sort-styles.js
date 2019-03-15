/**
 * @fileoverview Rule to require StyleSheet object keys to be sorted
 * @author Mats Byrkjeland
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { astHelpers } = require('../util/stylesheet');

const {
  getStyleDeclarationsChunks,
  getPropertiesChunks,
  getStylePropertyIdentifier,
  isStyleSheetDeclaration,
  isEitherShortHand,
} = astHelpers;

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = (context) => {
  const order = context.options[0] || 'asc';
  const options = context.options[1] || {};
  const ignoreClassNames = options.ignoreClassNames;
  const ignoreStyleProperties = options.ignoreStyleProperties;
  const isValidOrder = order === 'asc' ? (a, b) => a <= b : (a, b) => a >= b;

  const sourceCode = context.getSourceCode();

  function sort(array) {
    return [].concat(array).sort((a, b) => {
      const identifierA = getStylePropertyIdentifier(a);
      const identifierB = getStylePropertyIdentifier(b);

      let sortOrder = 0;
      if (isEitherShortHand(identifierA, identifierB)) {
        return a.range[0] - b.range[0];
      } else if (identifierA < identifierB) {
        sortOrder = -1;
      } else if (identifierA > identifierB) {
        sortOrder = 1;
      }
      return sortOrder * (order === 'asc' ? 1 : -1);
    });
  }

  function getActualRange(node) {
    const range = [].concat(node.range);
    range[0] = sourceCode
      .getCommentsBefore(node)
      .reduce((start, comment) => Math.min(start, comment.range[0]), range[0]);
    return range;
  }

  function report(array, type, node, prev, current) {
    const currentName = getStylePropertyIdentifier(current);
    const prevName = getStylePropertyIdentifier(prev);
    context.report({
      node,
      message: `Expected ${type} to be in ${order}ending order. '${currentName}' should be before '${prevName}'.`,
      loc: current.key.loc,
      fix(fixer) {
        const sortedArray = sort(array);
        return array
          .map((item, i) => {
            if (item !== sortedArray[i]) {
              const actualRange = getActualRange(sortedArray[i]);
              return fixer.replaceTextRange(
                getActualRange(item),
                sourceCode.text.slice(actualRange[0], actualRange[1])
              );
            }
            return null;
          })
          .filter(Boolean);
      },
    });
  }

  function checkIsSorted(array, arrayName, node) {
    for (let i = 1; i < array.length; i += 1) {
      const previous = array[i - 1];
      const current = array[i];

      if (previous.type !== 'Property' || current.type !== 'Property') {
        return;
      }

      const prevName = getStylePropertyIdentifier(previous);
      const currentName = getStylePropertyIdentifier(current);

      if (
        arrayName === 'style properties' &&
        isEitherShortHand(prevName, currentName)
      ) {
        return;
      }

      if (!isValidOrder(prevName, currentName)) {
        return report(array, arrayName, node, previous, current);
      }
    }
  }

  return {
    VariableDeclarator: function (node) {
      if (!isStyleSheetDeclaration(node, context.settings)) {
        return;
      }

      const classDefinitionsChunks = getStyleDeclarationsChunks(node);

      if (!ignoreClassNames) {
        classDefinitionsChunks.forEach((classDefinitions) => {
          checkIsSorted(classDefinitions, 'class names', node);
        });
      }

      if (ignoreStyleProperties) return;

      classDefinitionsChunks.forEach((classDefinitions) => {
        classDefinitions.forEach((classDefinition) => {
          const styleProperties = classDefinition.value.properties;
          if (!styleProperties || styleProperties.length < 2) {
            return;
          }
          const stylePropertyChunks = getPropertiesChunks(styleProperties);
          stylePropertyChunks.forEach((stylePropertyChunk) => {
            checkIsSorted(stylePropertyChunk, 'style properties', node);
          });
        });
      });
    },
  };
};

module.exports.fixable = 'code';
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
