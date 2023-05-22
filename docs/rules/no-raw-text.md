# Detect raw text outside of `Text` component (`react-native/no-raw-text`)

💼 This rule is enabled in the 🌐 `all` [config](https://github.com/Intellicode/eslint-plugin-react-native#shareable-configurations).

<!-- end auto-generated rule header -->

All strings in React Native should be wrapped with a Text component.

## Rule Details

The following patterns are considered warnings:

```js
<View>some text</View>
```

```js
const text = 'some text';
<View>{`${text}`}</View>
```

The following patterns are not considered warnings:

```js
<View><Text>some text</Text></View>
```

```js
const text = 'some text';
<View><Text>{`${text}`}</Text></View>
```

## Options

This rule has an object option:

- "skip" – allow to skip checking for the array of custom components
