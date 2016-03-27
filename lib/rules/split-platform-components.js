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

  function getKeyValue(node) {
    const key = node.key || node.argument;
    return key.type === 'Identifier' ? key.name : key.value;
  }

  function hasNodeWithName(nodes, name) {
    return nodes.some((node) => {
      const nodeName = getKeyValue(node);
      return nodeName && nodeName.includes(name);
    });
  }

  function reportErrors(components, filename) {
    const containsAndroidAndIOS = (
      hasNodeWithName(components, 'IOS') &&
      hasNodeWithName(components, 'Android')
    );

    for (let i = 0; i < components.length; i++) {
      const node = components[i];
      const propName = getKeyValue(node);

      if (propName.includes('IOS') && !filename.endsWith('.ios.js')) {
        context.report(node, containsAndroidAndIOS ? conflictMessage : iosMessage);
      }

      if (propName.includes('Android') && !filename.endsWith('.android.js')) {
        context.report(node, containsAndroidAndIOS ? conflictMessage : androidMessage);
      }
    }
  }

  return {
    VariableDeclarator: function (node) {
      const destructuring = node.init && node.id && node.id.type === 'ObjectPattern';
      const statelessDestructuring = destructuring && node.init.name === 'React';
      if (destructuring && statelessDestructuring) {
        reactComponents = reactComponents.concat(node.id.properties);
      }
    },
    'Program:exit': function () {
      const filename = context.getFilename();
      reportErrors(reactComponents, filename);
    },
  };
};

module.exports.schema = [];
