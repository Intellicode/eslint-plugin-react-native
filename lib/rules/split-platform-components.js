/**
 * @fileoverview Android and IOS components should be
 * used in platform specific React Native components.
 * @author Tom Hastjarjanto
 */
'use strict';

module.exports =  function(context) {
  var reactComponents = [];
  var androidMessage = 'Android components should be placed in android files';
  var iosMessage = 'IOS components should be placed in ios files';
  var conflictMessage = 'IOS and Android components can\'t be mixed';

  function getKeyValue(node) {
    var key = node.key || node.argument;
    return key.type === 'Identifier' ? key.name : key.value;
  }

  function hasNodeWithName(node, name) {
    return node.some(function(node) {
      var nodeName = getKeyValue(node)
      return nodeName && nodeName.includes(name);
    })
  }

  function reportErrors(components, filename) {
    var containsAndroidAndIOS = (
      hasNodeWithName(components, 'IOS') &&
      hasNodeWithName(components, 'Android')
    );

    for(var i = 0; i < components.length; i++) {
      var node = components[i];
      var propName = getKeyValue(node);

      if (propName.includes('IOS') && !filename.endsWith('.ios.js')) {
        context.report(node, containsAndroidAndIOS ? conflictMessage : iosMessage)
      }

      if (propName.includes('Android') && !filename.endsWith('.android.js')) {
        context.report(node, containsAndroidAndIOS ? conflictMessage : androidMessage)
      }
    }
  }

  return {
    VariableDeclarator: function(node) {
      var destructuring = node.init && node.id && node.id.type === 'ObjectPattern';
      var statelessDestructuring = destructuring && node.init.name === 'React';
      if (destructuring && statelessDestructuring) {
        reactComponents = reactComponents.concat(node.id.properties);
      }
    },
    'Program:exit': function() {
      var filename = context.getFilename();
      reportErrors(reactComponents, filename);
    }
  };
};

module.exports.schema = [];
