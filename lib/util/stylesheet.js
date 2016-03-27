
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
StyleSheets.prototype.add = function(styleSheetName, properties) {
  this._styleSheets[styleSheetName] = properties;
}

/**
 * MarkAsUsed marks a rule as used in our source code by removing it from the
 * specified StyleSheet rules.
 *
 * @param {string} fullyQualifiedName - The fully qualified name of the rule.
 * for example 'styles.text'
 */
StyleSheets.prototype.markAsUsed = function(fullyQualifiedName) {
  var nameSplit = fullyQualifiedName.split('.');
  var styleSheetName = nameSplit[0];
  var styleSheetProperty = nameSplit[1];

  if (this._styleSheets[styleSheetName]) {
    this._styleSheets[styleSheetName] = this
      ._styleSheets[styleSheetName]
      .filter(function(property) {
        return property.key.name !== styleSheetProperty;
      });
  }
}

/**
* GetUnusedReferences returns all collected StyleSheets and their
* unmarked rules.
*/
StyleSheets.prototype.getUnusedReferences = function() {
  return this._styleSheets;
}

module.exports.StyleSheets = StyleSheets;
