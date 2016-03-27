/**
 * @fileoverview Detects unused styles
 * @author Tom Hastjarjanto
 */
'use strict';
var Components = require('../util/Components');
var StyleSheets = require('../util/stylesheet').StyleSheets;

module.exports =  Components.detect(function(context, components, utils) {
  var sourceCode = context.getSourceCode();
  var styleSheets = new StyleSheets();
  var styleReferences = new Set();

  function containsStyleSheetObject(node) {
    return Boolean(
      node &&
      node.init &&
      node.init.callee &&
      node.init.callee.object &&
      node.init.callee.object.name === 'StyleSheet'
    );
  }

  function containsCreateCall(node) {
    return Boolean(
      node &&
      node.init &&
      node.init.callee &&
      node.init.callee.property &&
      node.init.callee.property.name === 'create'
    );
  }

  function isStyleSheetDeclaration(node) {
    return Boolean(
      containsStyleSheetObject(node) &&
      containsCreateCall(node)
    );
  }

  function getStyleSheetName(node) {
    if (
      node &&
      node.id
    ) {
      return node.id.name;
    }
  }

  function getStyleDeclarations(node) {
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
  }

  function isStyleAttribute(node) {
    return Boolean(
      node.type === 'JSXAttribute' &&
      node.name &&
      node.name.name &&
      node.name.name.toLowerCase().includes('style')
    );
  }

  function collectStyleReferences(node) {
    if (hasArrayOfStyleReferences(node)) {
      var styleReferenceContainers = node
        .expression
        .elements;

      return collectStyleReferencesFromContainers(
        styleReferenceContainers
      );
    } else {
      return [getStyleReferenceFromExpression(node.expression)];
    }
  }

  function collectStyleReferencesFromContainers(nodes) {
    var styleReferences = [];
    nodes.forEach(function(node) {
      styleReferences = styleReferences.concat(getStyleReferenceFromNode(node));
    });

    return styleReferences;
  }

  function getStyleReferenceFromNode(node) {
    switch (node.type) {
      case 'MemberExpression':
        var styleReference = getStyleReferenceFromExpression(node);
        return [styleReference];
        break;
      case 'LogicalExpression':
        var leftStyleReferences = getStyleReferenceFromNode(node.left);
        var rightStyleReferences = getStyleReferenceFromNode(node.right);
        return [].concat(leftStyleReferences).concat(rightStyleReferences);
        break;
      case 'ConditionalExpression':
        var leftStyleReferences = getStyleReferenceFromNode(node.consequent);
        var rightStyleReferences = getStyleReferenceFromNode(node.alternate);
        return [].concat(leftStyleReferences).concat(rightStyleReferences);
        return [];
        break;
      default:
        return [];
    }
  }

  function hasArrayOfStyleReferences(node) {
    return Boolean(
      node.type === 'JSXExpressionContainer' &&
      node.expression &&
      node.expression.type === 'ArrayExpression'
    );
  }

  function getStyleReferenceFromExpression(node) {
    var result = [];
    var name = getObjectName(node);
    if (name) {
      result.push(name);
    }

    var property = getPropertyName(node);
    if (property) {
      result.push(property);
    }

    return result.join('.');
  }

  function getObjectName(node) {
    if (
      node &&
      node.object &&
      node.object.name
    ) {
      return node.object.name;
    }
  }

  function getPropertyName(node) {
    if (
      node &&
      node.property &&
      node.property.name
    ) {
      return node.property.name;
    }
  }

  function reportUnusedStyles(styleSheets) {
    for(var key in styleSheets) {
      if (styleSheets.hasOwnProperty(key)) {
        var styles = styleSheets[key];
        styles.forEach(function(node) {
          var message = [
            'Unused style detected: ',
            key,
            '.',
            node.key.name
          ].join('');

          context.report(node, message);
        });
      }
    }
  }

  return {
    VariableDeclarator: function(node) {
      if (isStyleSheetDeclaration(node)) {
        var styleSheetName = getStyleSheetName(node);
        var styles = getStyleDeclarations(node);

        styleSheets.add(styleSheetName, styles);
      }
    },

    JSXAttribute: function(node) {
      if (isStyleAttribute(node)) {
        var styles = collectStyleReferences(node.value);
        styles.forEach(function(style) {
          styleReferences.add(style);
        });
      }
    },

    'Program:exit': function() {
      var list = components.list();
      if (Object.keys(list).length > 0) {
        styleReferences.forEach(function(reference){
          styleSheets.markAsUsed(reference);
        });
        reportUnusedStyles(styleSheets.getUnusedReferences());
      }
    }
  };
});

module.exports.schema = [];
