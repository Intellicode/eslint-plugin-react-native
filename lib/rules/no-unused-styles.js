'use strict';

const noUnusedStylesStable = require('./no-unused-styles.stable');

function create(context) {
  const isExperimental = context.options[0] && context.options[0].enableImportsCheck === true;

  if (isExperimental) {
    // eslint-disable-next-line global-require
    const noUnusedStylesExperimental = require('./no-unused-styles.experimental');

    return noUnusedStylesExperimental.create(context);
  }

  return noUnusedStylesStable.create(context);
}

module.exports = {
  meta: {
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: { enableImportsCheck: { type: 'boolean' } },
      },
    ],
  },
  create,
};
