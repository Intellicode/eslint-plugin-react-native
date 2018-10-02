/**
 * @fileoverview Detects raw text outside of Text component
 * @author Alex Zhukov
 */

'use strict';

module.exports = (context) => {
  const elementName = node => (
    node.openingElement &&
    node.openingElement.name &&
    node.openingElement.name.type === 'JSXIdentifier' &&
    node.openingElement.name.name
  );

  const report = (node) => {
    const errorValue = node.type === 'TemplateLiteral'
      ? `TemplateLiteral: ${node.expressions[0].name}`
      : node.value;
    context.report({
      node,
      message: `Raw text (${errorValue.trim()}) cannot be used outside of a <Text> tag`,
    });
  };

  const getValidation = node => elementName(node.parent) !== 'Text';

  return {
    Literal(node) {
      const parentType = node.parent.type;
      const onlyFor = ['JSXExpressionContainer', 'JSXElement'];
      if (/^[\s]+$/.test(node.value) ||
        typeof node.value !== 'string' ||
        !onlyFor.includes(parentType) ||
        (node.parent.parent && node.parent.parent.type === 'JSXAttribute')
      ) return;

      const isStringLiteral = parentType === 'JSXExpressionContainer';
      if (getValidation(isStringLiteral ? node.parent : node)) {
        report(node);
      }
    },

    JSXText(node) {
      if (getValidation(node)) {
        report(node);
      }
    },

    TemplateLiteral(node) {
      if (
        node.parent.type !== 'JSXExpressionContainer' ||
        (node.parent.parent && node.parent.parent.type === 'JSXAttribute')
      ) return;

      if (getValidation(node.parent)) {
        report(node);
      }
    },
  };
};

module.exports.schema = [];
