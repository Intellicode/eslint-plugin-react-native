# Detect raw text outside of Text component
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
