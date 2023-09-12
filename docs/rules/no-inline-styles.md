# Detect inline styles in components
It's (subjectively) good practice to separate styles from the view layout, when possible. 
This rule detects inline style objects when they contain literal values. If inline styles only contain
variable values, the style is considered acceptable because it's sometimes necessary to set styles 
based on `state` or `props`.

## Rule Details

The following pattern is considered a warning:

```js
const Hello = React.createClass({
  render: function() {
    return <Text style={{backgroundColor: '#FFF'}}>Hello {this.props.name}</Text>;
  }
});
```

The following pattern fails only on the `backgroundColor` property, not the `fontSize`:

```js
const Hello = React.createClass({
  render: function() {
    return <Text style={{backgroundColor: '#FFF', fontSize: this.state.fontSize}}>Hello {this.props.name}</Text>;
  }
});
```

The following pattern is not considered a warning:
```js
const Hello = React.createClass({
  render: function() {
    return <Text style={styles.name}>Hello {this.props.name}</Text>;
  }
});
```
Any attribute that contains the word `style` is checked for inline object literals. Both of the following
are considered warnings:

```js

const Hello = React.createClass({
  render: function() {
    return <Text style={{fontSize: 12}}>Hello {this.props.name}</Text>;
  }
});
const Welcome = React.createClass({
  render: function() {
    return <Text textStyle={{fontSize: 12}}>Welcome</Text>;
  }
});
```

#### This rule has an object option:

- "allowStylePropertiesLessThan" – allow style properties count less than a specific number. for e.g. `2` will allow `{fontSize: 15}` but not `{fontSize: 15, fontColor: 'white'}`


