'use strict';
/**
 * StyleSheets represents the StyleSheets found in the source code.
 * @constructor
 */
function StyleSheets() {
  this._styleSheets = {};
}

/**
 * Add adds a StyleSheet to our StyleSheets collections.
 *
 * @param {string} styleSheetName - The name of the StyleSheet.
 * @param {object} properties - The collection of rules in the styleSheet.
 */
StyleSheets.prototype.add = function (styleSheetName, properties) {
  this._styleSheets[styleSheetName] = properties;
};

/**
 * MarkAsUsed marks a rule as used in our source code by removing it from the
 * specified StyleSheet rules.
 *
 * @param {string} fullyQualifiedName - The fully qualified name of the rule.
 * for example 'styles.text'
 */
StyleSheets.prototype.markAsUsed = function (fullyQualifiedName) {
  const nameSplit = fullyQualifiedName.split('.');
  const styleSheetName = nameSplit[0];
  const styleSheetProperty = nameSplit[1];

  if (this._styleSheets[styleSheetName]) {
    this._styleSheets[styleSheetName] = this
      ._styleSheets[styleSheetName]
      .filter((property) => property.key.name !== styleSheetProperty);
  }
};

/**
* GetUnusedReferences returns all collected StyleSheets and their
* unmarked rules.
*/
StyleSheets.prototype.getUnusedReferences = function () {
  return this._styleSheets;
};

const astHelpers = {
  containsStyleSheetObject: function (node) {
    return Boolean(
      node &&
      node.init &&
      node.init.callee &&
      node.init.callee.object &&
      node.init.callee.object.name === 'StyleSheet'
    );
  },

  containsCreateCall: function (node) {
    return Boolean(
      node &&
      node.init &&
      node.init.callee &&
      node.init.callee.property &&
      node.init.callee.property.name === 'create'
    );
  },

  isStyleSheetDeclaration: function (node) {
    return Boolean(
      astHelpers.containsStyleSheetObject(node) &&
      astHelpers.containsCreateCall(node)
    );
  },

  getStyleSheetName: function (node) {
    if (
      node &&
      node.id
    ) {
      return node.id.name;
    }
  },

  getStyleDeclarations: function (node) {
    if (
      node &&
      node.init &&
      node.init.arguments &&
      node.init.arguments[0] &&
      node.init.arguments[0].properties
    ) {
      return node
        .init
        .arguments[0]
        .properties;
    }

    return [];
  },

  isStyleAttribute: function (node) {
    return Boolean(
      node.type === 'JSXAttribute' &&
      node.name &&
      node.name.name &&
      node.name.name.toLowerCase().includes('style')
    );
  },

  collectStyleReferences: function (node) {
    if (astHelpers.hasArrayOfStyleReferences(node)) {
      const styleReferenceContainers = node
        .expression
        .elements;

      return astHelpers.collectStyleReferencesFromContainers(
        styleReferenceContainers
      );
    }

    return astHelpers.getStyleReferenceFromNode(node.expression);
  },

  collectStyleReferencesFromContainers: function (nodes) {
    let styleReferences = [];
    nodes.forEach((node) => {
      styleReferences = styleReferences.concat(astHelpers.getStyleReferenceFromNode(node));
    });

    return styleReferences;
  },

  getStyleReferenceFromNode: function (node) {
    let styleReference;
    let leftStyleReferences;
    let rightStyleReferences;

    switch (node.type) {
      case 'MemberExpression':
        styleReference = astHelpers.getStyleReferenceFromExpression(node);
        return [styleReference];
      case 'LogicalExpression':
        leftStyleReferences = astHelpers.getStyleReferenceFromNode(node.left);
        rightStyleReferences = astHelpers.getStyleReferenceFromNode(node.right);
        return [].concat(leftStyleReferences).concat(rightStyleReferences);
      case 'ConditionalExpression':
        leftStyleReferences = astHelpers.getStyleReferenceFromNode(node.consequent);
        rightStyleReferences = astHelpers.getStyleReferenceFromNode(node.alternate);
        return [].concat(leftStyleReferences).concat(rightStyleReferences);
      default:
        return [];
    }
  },

  hasArrayOfStyleReferences: function (node) {
    return Boolean(
      node.type === 'JSXExpressionContainer' &&
      node.expression &&
      node.expression.type === 'ArrayExpression'
    );
  },

  getStyleReferenceFromExpression: function (node) {
    const result = [];
    const name = astHelpers.getObjectName(node);
    if (name) {
      result.push(name);
    }

    const property = astHelpers.getPropertyName(node);
    if (property) {
      result.push(property);
    }

    return result.join('.');
  },

  getObjectName: function (node) {
    if (
      node &&
      node.object &&
      node.object.name
    ) {
      return node.object.name;
    }
  },

  getPropertyName: function (node) {
    if (
      node &&
      node.property &&
      node.property.name
    ) {
      return node.property.name;
    }
  },
};

module.exports.astHelpers = astHelpers;
module.exports.StyleSheets = StyleSheets;
