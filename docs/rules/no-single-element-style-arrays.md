# Disallow single element style arrays. These cause unnecessary re-renders as the identity of the array always changes (`react-native/no-single-element-style-arrays`)

💼 This rule is enabled in the 🌐 `all` [config](https://github.com/Intellicode/eslint-plugin-react-native#shareable-configurations).

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

These cause unnecessary re-renders as each time the array's identity changes.

## Rule Details

The following pattern is not allowed:

```js
<View style={[{height: 10}]} />
```

