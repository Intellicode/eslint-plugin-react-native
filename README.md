
ESLint plugin for React Native
==============================

React Native specific linting rules for ESLint. This repository is structured like  (and contains code from) the excellent [eslint-plugin-react](http://github.com/yannickcr/eslint-plugin-react).

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
$ npm install eslint
```

To make most use of this plugin, its recommended to install [eslint-plugin-react](http://github.com/yannickcr/eslint-plugin-react) in addition to [ESLint](https://www.github.com/eslint/eslint). If you installed `ESLint` globally, you have to install eslint-plugin-react globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-react
```

Similarly, install eslint-plugin-react-native


```sh
$ npm install eslint-plugin-react-native
```

# Configuration

Add `plugins` section and specify ESLint-plugin-React (optional) and ESLint-plugin-react-native as a plugin.

```json
{
  "plugins": [
    "react",
    "react-native"
  ]
}
```

If it is not already the case you must also configure `ESLint` to support JSX.

```json
{
  "ecmaFeatures": {
    "jsx": true
  }
}
```

Finally, enable all of the rules that you would like to use.

```json
{
  "rules": {
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
  }
}
```

# List of supported rules

* [no-unused-styles](docs/rules/no-unused-styles.md): Detect `StyleSheet` rules which are not used in your React components
* [no-unused-styles](docs/rules/split-platform-components.md): Enforce using platform specific filenames when necessary
