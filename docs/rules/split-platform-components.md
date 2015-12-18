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

filename: <any>.js
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
