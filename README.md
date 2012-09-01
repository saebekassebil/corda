# Corda

Corda is a simple JavaScript library for rendering guitar chord symbols.
For the time being, it only supports Canvas rendering, but SVG will probably
be supported at some time.

## Usage

```javascript
var aminor = Corda.symbol({
  notes: ['x', 'o', 2, 2, 1, 'o']
});

aminor.render(canvasElement);
```
