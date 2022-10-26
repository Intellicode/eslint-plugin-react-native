# Enforce using platform specific filenames when necessary (`react-native/split-platform-components`)

💼 This rule is enabled in the 🌐 `all` [config](https://github.com/Intellicode/eslint-plugin-react-native#shareable-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

When working on a project that supports both Android and IOS, you have to make sure that you
use platform specific filenames when you use platform specific components to produce the correct
bundle per platform.

The following patterns are considered warnings:

filename: Hello.js

```js
const React = require('react-native');
const {
  ActivityIndicatiorIOS,
} = React;

const Hello = React.createClass({
  render: function() {
    return <ActivityIndicatiorIOS />;
  }
});
```

filename: Hello.js

```js
const React = require('react-native');
const {
  ProgressBarAndroid,
} = React;

const Hello = React.createClass({
  render: function() {
    return <ProgressBarAndroid />;
  }
});
```

Any filename

```js
const React = require('react-native');
const {
  ProgressBarAndroid,
  ActivityIndicatiorIOS,
  View
} = React;

const Hello = React.createClass({
  render: function() {
    return <View>
      <ProgressBarAndroid />
      <ActivityIndicatiorIOS />
    </View>;
  }
});
```

Using `import` declaration pattern: Hello.js

```js
import React from 'react'
import { ActivityIndicatiorIOS } from 'react-native'

export default function Hello() {
  return <ActivityIndicatiorIOS/>
}
```

The following patterns are not considered warnings:

filename: Hello.ios.js

```js
const React = require('react-native');
const {
  ActivityIndicatiorIOS,
} = React;

const Hello = React.createClass({
  render: function() {
    return <ActivityIndicatiorIOS />;
  }
});
```

filename: Hello.android.js

```js
const React = require('react-native');
const {
  ProgressBarAndroid,
} = React;

const Hello = React.createClass({
  render: function() {
    return <ProgressBarAndroid />;
  }
});
```

Using `import` declaration pattern: Hello.ios.js

```js
import React from 'react'
import { ActivityIndicatiorIOS } from 'react-native'

export default function Hello() {
  return <ActivityIndicatiorIOS/>
}
```

## Rule Options

```js
...
"react-native/split-platform-components": [ <enabled>, {
  androidPathRegex: <string>,
  iosPathRegex: <string>
}]
...
```

### `androidPathRegex`

A RegExp pattern to use for Android platform components. You can include other custom filenames like so:

```js
'react-native/split-platform-components': [2, {androidPathRegex: '\\.android.(js|jsx|ts|tsx)$'}]
```

### `iosPathRegex`

A RegExp pattern to use for iOS platform components. You can include other custom filenames like so:

```js
'react-native/split-platform-components': [2, {iosPathRegex: '\\.ios.(js|jsx|ts|tsx)$'}]
```
