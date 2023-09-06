/**
 * @fileoverview Detects raw text outside of Text component
 * @author Alex Zhukov
 */

'use strict';

const elementName = (node) => {
  const reversedIdentifiers = [];
  if (
    node.type === 'JSXElement'
    && node.openingElement.type === 'JSXOpeningElement'
  ) {
    let object = node.openingElement.name;
    while (object.type === 'JSXMemberExpression') {
      if (object.property.type === 'JSXIdentifier') {
        reversedIdentifiers.push(object.property.name);
      }
      object = object.object;
    }

    if (object.type === 'JSXIdentifier') {
      reversedIdentifiers.push(object.name);
    }
  }

  return reversedIdentifiers.reverse().join('.');
};

const hasAllowedParent = (parent, allowedElements) => {
  let curNode = parent;

  while (curNode) {
    if (curNode.type === 'JSXElement') {
      const name = elementName(curNode);
      if (allowedElements.includes(name)) {
        return true;
      }
    }
    curNode = curNode.parent;
  }

  return false;
};

function create(context) {
  const options = context.options[0] || {};

  const report = (node) => {
    const errorValue = node.type === 'TemplateLiteral'
      ? `TemplateLiteral: ${node.expressions[0].name}`
      : node.value.trim();

    const formattedErrorValue = errorValue.length > 0
      ? `Raw text (${errorValue})`
      : 'Whitespace(s)';

    context.report({
      node,
      message: `${formattedErrorValue} cannot be used outside of a <Text> tag`,
    });
  };

  const skippedElements = options.skip ? options.skip : [];
  const allowedElements = ['Text', 'TSpan', 'StyledText', 'Animated.Text'].concat(skippedElements);

  const hasOnlyLineBreak = (value) => /^[\r\n\t\f\v]+$/.test(value.replace(/ /g, ''));

  const getValidation = (node) => !hasAllowedParent(node.parent, allowedElements);

  return {
    Literal(node) {
      const parentType = node.parent.type;
      const onlyFor = ['JSXExpressionContainer', 'JSXElement'];
      if (typeof node.value !== 'string'
        || hasOnlyLineBreak(node.value)
        || !onlyFor.includes(parentType)
        || (node.parent.parent && node.parent.parent.type === 'JSXAttribute')
      ) return;

      const isStringLiteral = parentType === 'JSXExpressionContainer';
      if (getValidation(isStringLiteral ? node.parent : node)) {
        report(node);
      }
    },

    JSXText(node) {
      if (typeof node.value !== 'string' || hasOnlyLineBreak(node.value)) return;
      if (getValidation(node)) {
        report(node);
      }
    },

    TemplateLiteral(node) {
      if (
        node.parent.type !== 'JSXExpressionContainer'
        || (node.parent.parent && node.parent.parent.type === 'JSXAttribute')
      ) return;

      if (getValidation(node.parent)) {
        report(node);
      }
    },
  };
}

module.exports = {
  meta: {
    schema: [
      {
        type: 'object',
        properties: {
          skip: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create,
};
