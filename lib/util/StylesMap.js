const fs = require('fs');

const parse = require('eslint-module-utils/parse').default;
const visit = require('eslint-module-utils/visit').default;
const resolve = require('eslint-module-utils/resolve').default;
const isIgnored = require('eslint-module-utils/ignore').default;
const { hasValidExtension } = require('eslint-module-utils/ignore');

const { hashObject } = require('eslint-module-utils/hash');
const unambiguous = require('eslint-module-utils/unambiguous');

const styleSheet = require('./stylesheet');

const { astHelpers } = styleSheet;

const exportCache = new Map();

class StylesMap {
  constructor() {
    this.errors = [];
    this.localStyles = {};
    this.exportsVarsMap = {};
  }

  addExportVars({ exportName, localName }) {
    this.exportsVarsMap[exportName] = localName;
  }

  getStylesByImportedName(importtedName) {
    const localName = this.exportsVarsMap[importtedName];

    return this.localStyles[localName] || [];
  }
}

/**
 * don't hold full context object in memory, just grab what we need.
 */
function childContext(path, context) {
  const { settings, parserOptions, parserPath } = context;
  return {
    settings,
    parserOptions,
    parserPath,
    path,
  };
}

StylesMap.reportErrors = function (context, declaration, errors) {
  const errorsStr = errors
    .map((e) => `${e.message} (${e.lineNumber}:${e.column})`)
    .join(', ');

  context.report({
    node: declaration.source,
    message:
      `Parse errors in imported module '${declaration.source.value}': `
      + `${errorsStr}`,
  });
};

StylesMap.get = function (source, context) {
  const path = resolve(source, context);
  if (path == null) return null;

  return StylesMap.for(childContext(path, context));
};

StylesMap.for = function (context) {
  const { path } = context;

  const cacheKey = hashObject(context).digest('hex');
  let exportMap = exportCache.get(cacheKey);

  // return cached ignore
  if (exportMap === null) return null;

  const stats = fs.statSync(path);

  if (exportMap != null) {
    // date equality check
    if (exportMap.mtime - stats.mtime === 0) {
      return exportMap;
    }
  }

  // check valid extensions first
  if (!hasValidExtension(path, context)) {
    exportCache.set(cacheKey, null);
    return null;
  }

  // check for and cache ignore
  if (isIgnored(path, context)) {
    exportCache.set(cacheKey, null);
    return null;
  }

  const content = fs.readFileSync(path, { encoding: 'utf8' });

  // check for and cache unambiguous modules
  if (!unambiguous.test(content)) {
    exportCache.set(cacheKey, null);
    return null;
  }

  exportMap = StylesMap.parse(path, content, context);

  // ambiguous modules return null
  if (exportMap == null) return null;

  exportMap.mtime = stats.mtime;

  exportCache.set(cacheKey, exportMap);
  return exportMap;
};

StylesMap.parse = function (path, content, context) {
  const stylesMap = new StylesMap(path);

  try {
    const result = parse(path, content, context);
    const { ast } = result;
    const { visitorKeys } = result;

    visit(ast, visitorKeys, {
      VariableDeclarator: function (node) {
        const callExpressionNode = node.init;
        if (
          astHelpers.isStyleSheetDeclaration(
            callExpressionNode,
            context.settings
          )
        ) {
          const styleSheetName = node.id.name;
          const styleDeclarations = astHelpers.getStyleDeclarations(callExpressionNode);

          stylesMap.localStyles[styleSheetName] = styleDeclarations;
        }
      },

      ExportNamedDeclaration(node) {
        const isVariable = node.declaration && node.declaration.type === 'VariableDeclaration';

        if (isVariable) {
          // Case: `export const a=1, b=2;`
          node.declaration.declarations.forEach(({ id }) => {
            stylesMap.addExportVars({ exportName: id.name, localName: id.name });
          });
        }

        // Case: `export {local as styles}`
        const isExportSpecifier = node.specifiers.length > 0;

        if (isExportSpecifier) {
          node.specifiers.forEach(({ local, exported }) => {
            stylesMap.addExportVars({
              exportName: exported.name,
              localName: local.name,
            });
          });
        }
      },

      ExportDefaultDeclaration(node) {
        if (node.declaration.type === 'Identifier') {
          const localName = node.declaration.name;

          stylesMap.addExportVars({ exportName: 'default', localName });
        }

        if (node.declaration.type === 'CallExpression') {
          if (
            astHelpers.isStyleSheetDeclaration(
              node.declaration,
              context.settings
            )
          ) {
            const styleSheetName = 'default';

            stylesMap.localStyles[styleSheetName] = astHelpers.getStyleDeclarations(
              node.declaration
            );

            stylesMap.addExportVars({
              exportName: 'default',
              localName: 'default',
            });
          }
        }
      },
    });

    return stylesMap;
  } catch (err) {
    stylesMap.errors.push(err);

    return stylesMap; // can't continue
  }
};

module.exports = StylesMap;
