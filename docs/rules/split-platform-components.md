# Enforce using platform specific filenames when necessary
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
