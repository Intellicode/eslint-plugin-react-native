/**
 * @fileoverview Android and IOS components should be
 * used in platform specific React Native components.
 * @author Tom Hastjarjanto
 */

'use strict';

module.exports = function (context) {
  let reactComponents = [];
  const androidMessage = 'Android components should be placed in android files';
  const iosMessage = 'IOS components should be placed in ios files';
  const conflictMessage = 'IOS and Android components can\'t be mixed';

  function getName(node) {
    if (node.type === 'Property') {
      const key = node.key || node.argument;
      return key.type === 'Identifier' ? key.name : key.value;
    } else if (node.type === 'Identifier') {
      return node.name;
    }
  }

  function hasNodeWithName(nodes, name) {
    return nodes.some((node) => {
      const nodeName = getName(node);
      return nodeName && nodeName.includes(name);
    });
  }

  function reportErrors(components, filename) {
    const containsAndroidAndIOS = (
      hasNodeWithName(components, 'IOS') &&
      hasNodeWithName(components, 'Android')
    );

    components.forEach((node) => {
      const propName = getName(node);

      if (propName.includes('IOS') && !filename.match(/\.ios(\.test)?\.js$/)) {
        context.report(node, containsAndroidAndIOS ? conflictMessage : iosMessage);
      }

      if (propName.includes('Android') && !filename.match(/\.android(\.test)?\.js$/)) {
        context.report(node, containsAndroidAndIOS ? conflictMessage : androidMessage);
      }
    });
  }

  return {
    VariableDeclarator: function (node) {
      const destructuring = node.init && node.id && node.id.type === 'ObjectPattern';
      const statelessDestructuring = destructuring && node.init.name === 'React';
      if (destructuring && statelessDestructuring) {
        reactComponents = reactComponents.concat(node.id.properties);
      }
    },
    ImportDeclaration: function (node) {
      if (node.source.value === 'react-native') {
        node.specifiers.forEach((importSpecifier) => {
          if (importSpecifier.type === 'ImportSpecifier') {
            reactComponents = reactComponents.concat(importSpecifier.imported);
          }
        });
      }
    },
    'Program:exit': function () {
      const filename = context.getFilename();
      reportErrors(reactComponents, filename);
    },
  };
};

module.exports.schema = [];
