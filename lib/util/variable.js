/**
 * @fileoverview Utility functions for React components detection
 * @author Yannick Croissant
 */

'use strict';

/**
 * Record that a particular variable has been used in code
 *
 * @param {String} name The name of the variable to mark as used.
 * @returns {Boolean} True if the variable was found and marked as used, false if not.
 */
function markVariableAsUsed(context, name, _node) {
  let scope = (context.sourceCode || context).getScope(_node);
  let variables;
  let i;
  let len;
  let found = false;

  // Special Node.js scope means we need to start one level deeper
  if (scope.type === 'global') {
    while (scope.childScopes.length) {
      ([scope] = scope.childScopes);
    }
  }

  do {
    variables = scope.variables;
    for (i = 0, len = variables.length; i < len; i++) { // eslint-disable-line no-plusplus
      if (variables[i].name === name) {
        variables[i].eslintUsed = true;
        found = true;
      }
    }
    scope = scope.upper;
  } while (scope);

  return found;
}

/**
 * Search a particular variable in a list
 * @param {Array} variables The variables list.
 * @param {Array} name The name of the variable to search.
 * @returns {Boolean} True if the variable was found, false if not.
 */
function findVariable(variables, name) {
  let i;
  let len;

  for (i = 0, len = variables.length; i < len; i++) { // eslint-disable-line no-plusplus
    if (variables[i].name === name) {
      return true;
    }
  }

  return false;
}

function getScope(context, node) {
  if (context.sourceCode && context.sourceCode.getScope) {
    return context.sourceCode.getScope(node);
  }
  return context.getScope();
}

/**
 * List all variable in a given scope
 *
 * Contain a patch for babel-eslint to avoid https://github.com/babel/babel-eslint/issues/21
 *
 * @param {Object} context The current rule context.
 * @param {Array} name The name of the variable to search.
 * @returns {Boolean} True if the variable was found, false if not.
 */
function variablesInScope(context, _n) {
  let scope = getScope(context, _n);
  let { variables } = scope;

  while (scope.type !== 'global') {
    scope = scope.upper;
    variables = scope.variables.concat(variables);
  }
  if (scope.childScopes.length) {
    variables = scope.childScopes[0].variables.concat(variables);
    if (scope.childScopes[0].childScopes.length) {
      variables = scope.childScopes[0].childScopes[0].variables.concat(variables);
    }
  }

  return variables;
}

module.exports = {
  findVariable: findVariable,
  variablesInScope: variablesInScope,
  markVariableAsUsed: markVariableAsUsed,
};
