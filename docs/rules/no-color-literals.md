# Detect `StyleSheet` rules and inline styles containing color literals instead of variables (`react-native/no-color-literals`)

💼 This rule is enabled in the 🌐 `all` [config](https://github.com/Intellicode/eslint-plugin-react-native#shareable-configurations).

<!-- end auto-generated rule header -->

When developing UIs, we often find ourselves reusing the same colors in multiple places in the UI.
If the colors have to be updated, they likely have to be updated across the board. So it's good practice
to store the color definitions in variables instead of hardcoding them inside styles. This rule
will detect color properties that have literals (ie strings) as values.

The rule looks at all properties that contain `color` (case-insensitive) in their name
in either `StyleSheet` definitions or JSX properties that have `style` in their name.

## Rule Details

The following patterns are considered warnings:

```js
  <Text style={{backgroundColor: '#FFF'}}>Hello</Text>;
```

```js
  <View style={{borderBottomColor: 'rgba(255, 125, 125, 0.5)'}}>
    ...
  </View>;
```

```js
  <Text textStyle={[styles.text, {backgroundColor: '#FFF'}]}>Hello</Text>;
```

```js
  <Text style={[styles.text, this.props.something && {backgroundColor: '#000'}]}>Hello</Text>;
```

```js
  <Text style={[styles.text, {backgroundColor: this.props.something ? '#FFF' : '#000'}]}>Hello</Text>;
```

```js
  const styles = StyleSheet.create({
    text: {
      color: 'blue'
    }
  });
```

```js
  const someVariable = false;
  const someColorVariable = 'green';
  const styles = StyleSheet.create({
    text: {
      color: someVariable ? 'blue' : someColorVariable
    }
  });
```

The following patterns are not considered warnings:

```js
  const white = '#fff';
    ...
  <Text style={{backgroundColor: white}}>Hello</Text>;
```

```js
  <View style={{borderBottomColor: this.state.borderBottomColor}}>
    ...
  </View>;
```

```js
  const $coolBlue = '#00F';
  const styles = StyleSheet.create({
    text: {
      color: $coolBlue
    }
  });
```
