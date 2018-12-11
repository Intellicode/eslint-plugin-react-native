# Require StyleSheet keys to be sorted
It's like [sort-keys](https://eslint.org/docs/rules/sort-keys), but just for React Native styles.

Keeping your style definitions sorted is a common convention that helps with readability. This rule lets you enforce an ascending (default) or descending alphabetical order for both "class names" and style properties.

## Rule Details

The following patterns are considered warnings:

```js
const styles = StyleSheet.create({
  button: {
    width: 100,
    color: 'green',
  },
});
```

```js
const styles = StyleSheet.create({
  button: {},
  anchor: {},
});
```

The following patterns are not considered warnings:

```js
const styles = StyleSheet.create({
  button: {
    color: 'green',
    width: 100,
  },
});
```

```js
const styles = StyleSheet.create({
  anchor: {},
  button: {},
});
```

## Options

```
{
    "react-native/sort-styles": ["error", "asc", { "ignoreClassNames": false, "ignoreStyleProperties": false }]
}
```

The 1st option is "asc" or "desc".

* `"asc"` (default) - enforce properties to be in ascending order.
* `"desc"` - enforce properties to be in descending order.

The 2nd option is an object which has 2 properties.

* `ignoreClassNames` - if `true`, order will not be enforced on the class name level. Default is `false`.
* `ignoreStyleProperties` - if `true`, order will not be enforced on the style property level. Default is `false`.

### desc

`/* eslint react-native/sort-styles: ["error", "desc"] */`

The following patterns are considered warnings:

```js
const styles = StyleSheet.create({
  button: {
    color: 'green',
    width: 100,
  },
});
```

```js
const styles = StyleSheet.create({
  anchor: {},
  button: {},
});
```

The following patterns are not considered warnings:

```js
const styles = StyleSheet.create({
  button: {
    width: 100,
    color: 'green',
  },
});
```

```js
const styles = StyleSheet.create({
  button: {},
  anchor: {},
});
```

### ignoreClassNames

`/* eslint react-native/sort-styles: ["error", "asc", { "ignoreClassNames": true }] */`

The following patterns are not considered warnings:

```js
const styles = StyleSheet.create({
  button: {
    color: 'green',
    width: 100,
  },
  anchor: {},
});
```

# ignoreStyleProperties

`/* eslint react-native/sort-styles: ["error", "asc", { "ignoreStyleProperties": true }] */`

The following patterns are not considered warnings:

```js
const styles = StyleSheet.create({
  anchor: {},
  button: {
    width: 100,
    color: 'green',
  },
});
```
