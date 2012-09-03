# Corda

Corda is a simple JavaScript library for rendering guitar chord symbols.
For the time being, it only supports Canvas rendering, but SVG will probably
be supported at some time.

Chord symbols can be rendered both with/without *name*, with/without *tuning* 
and with/without *fret number*, and in all sorts of different sizes/metrics.

## Usage

```javascript
var aminor = Corda.symbol({
  notes: ['x', 'o', 2, 2, 1, 'o']
});

aminor.render(canvasElement);
```

## Renderings
![EbMaj9](http://cloud.github.com/downloads/saebekassebil/corda/ebmaj9.png)
![G](http://cloud.github.com/downloads/saebekassebil/corda/g.png)
![Cm7](http://cloud.github.com/downloads/saebekassebil/corda/cm9.png)
![D](http://cloud.github.com/downloads/saebekassebil/corda/d.png)

## API

### Corda

#### Corda.symbol(object:chordParameters)
 - Shortcut for creating a new CordaSymbol with the given parameters

#### Corda.style(string:key, string:val)
 - Sets the global style for *a single* style attribute

#### Corda.style(object:styleObject)
 - Sets the style for a range of style attributes (using the object's key -> value mapping)

### CordaSymbol(object:chordParameters)
 - Creates an internal representation of a chord symbol, with the given parameters

**chordParameters** is an object that defines the chord symbol, it can have one or more of these parameters:
 - **notes** - An array of the notes/dots to render. (Fx: `['x', '0', 2, 2, 1, 'o']` for an Am chord.)
   - Use 'x' for a note that isn't played, but displayed as an 'x' over the nut
   - Use 'o' for an open string, displayed as an 'o' over the nut.
   - Use a `Number` for displaying a dot on the given fret (relative to the uppermost fret)
   - Use `null` for displaying nothing on the string.

 - *[fret=0]* - Defines the fret number of the uppermost fret. Notice that this *doesn't* show the fret number
   unless you also sets *showFret* to `true`.
 - *[showFret=false]* - Shows the fret number if set to `true`. For example: '4fr', '8fr' etc.
 - *[frets]* - Defines the number of frets to render. Usable for displaying a whole fretboard.
 - *[strings=6]* - Defines the number of strings to display (usable for fx displaying bass symbols)
 - *[name]* - Defines and displays the name of the chord centered in the top of chord symbol
 - *[tuning]* - An array that defines and display the instrument's tuning.
   - For example `['E', 'A', 'D', 'G', 'B', 'e']` and `['D', 'A', 'D', 'G', 'B', 'e']`
 - *[style]* - An object of style attributes (similar to the Corda.style object)

#### CordaSymbol#render(DOMElement:canvas)
 - Renders the symbol unto a canvas object, respecting the canvas' metrics.

#### CordaSymbol#style(...)
 - Similar to Corda.style(...), but only for settings style for *this particular* CordaSymbol.