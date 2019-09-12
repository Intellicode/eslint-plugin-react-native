# No Single Element Style Arrays are allowed

These cause unnecessary re-renders as each time the array's identity changes.

## Rule Details

The following pattern is not allowed:

```js
<View style={[{height: 10}]} />
```

