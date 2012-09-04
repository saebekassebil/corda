/**
 * Corda.js - Jakob Miland <saebekassebil@gmail.com>
 *
 **/
(function cordaClosure() {
  function renderCircle(ctx, x, y, radius, outline) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (outline) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.fill();
    }

    ctx.closePath();
  }

  function renderCross(ctx, x, y, size) {
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = Corda.styles.cross;
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.moveTo(x + size / 2, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.stroke();
    ctx.restore();
    ctx.closePath();
  }

  function CordaSymbol(options) {
    this.options = options;
    this.fret = options.fret || 0;
    this.notes = options.notes;
    this.name = options.name;
    this.styles = {};

    // Copy main style, and apply private styling
    options.styles = options.styles || {};
    for (var i in Corda.styles) {
      if (Corda.styles.hasOwnProperty(i)) {
        this.styles[i] = options.styles[i] || Corda.styles[i];
      }
    }
  }

  CordaSymbol.prototype = {
    /**
     * #render(DOMElement canvas)
     *  - Renders the chord symbol onto a <canvas> element
     **/
    render: function(canvas) {
      var   ctx = canvas.getContext('2d')
          , height = canvas.height
          , width = canvas.width
          , options = this.options
          , frets = options.frets || 5
          , strings = options.strings || 6
          , fretUnitY = height / (frets + 1)
          , fretUnitX = width / strings
          , fretUnit = Math.min(fretUnitY, fretUnitX)
          , marginLeft = fretUnit / 2
          , marginRight = fretUnit / 2
          , marginTop = fretUnit
          , symbolWidth = width - marginLeft - marginRight - 1
          , symbolHeight = height - marginTop - 1
          , stringUnit = symbolWidth / (strings - 1)
          , nutWidth = fretUnit / 4
          , fontSize = fretUnit / 3 * 2
          , notes = this.notes
          , i, length, x, y, yshift, text, tuning;


      ctx.save();
      ctx.font = fontSize + 'px ' + this.styles.font;

      if (options.name) {
        marginTop += fontSize;
        symbolHeight = height - marginTop - 1;
      }

      // Render the fret number
      if (options.showFret && this.fret !== 0) {
        text = this.fret.toString(10) + 'fr';
        marginRight += ctx.measureText(text).width;
        symbolWidth = width - marginRight - marginLeft - 1;
        stringUnit = symbolWidth / (strings - 1);

        ctx.fillText(
            text,
            symbolWidth + stringUnit,
            marginTop + fretUnit / 3 * 2
        );
      }

      if (options.name) {
        ctx.save();
        text = options.name;
        ctx.font = 'bold ' + fontSize + 'px ' + this.styles.font;
        ctx.fillText(
            text,
            marginLeft + symbolWidth / 2 - ctx.measureText(text).width / 2,
            fontSize
        );
        ctx.restore();
      }

      // Render the tuning if supplied
      if ((tuning = options.tuning)) {
        for (i = 0, length = tuning.length; i < length; i++) {
          text = tuning[i];
          ctx.fillText(
              text,
              marginLeft + stringUnit * i - ctx.measureText(text).width / 2,
              marginTop - fontSize / 2
          );
        }
      }

      // Render the strings
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.styles.string;
      for (i = 0; i < strings; i++) {
        ctx.beginPath();
        x = marginLeft + i * stringUnit;
        ctx.moveTo(x, marginTop);
        ctx.lineTo(x, height);
        ctx.closePath();
        ctx.stroke();
      }

      // Render the frets
      yshift = symbolHeight / frets;
      ctx.strokeStyle = this.styles.fret;
      for (i = 0; i < frets + 1; i++) {
        ctx.save();
        y = marginTop + i * yshift;
        x = marginLeft;

        if (this.fret === 0 && i === 0) {
          ctx.strokeStyle = this.styles.nut;
          ctx.lineWidth = nutWidth;
          x -= 0.5;
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(width - marginRight - 0.5, y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Render the notes
      for (i = 0; i < notes.length; i++) {
        ctx.save();
        x = marginLeft + i * stringUnit;
        y = marginTop;
        if (notes[i] === 'x') {
          ctx.lineWidth = 2;
          ctx.strokeStyle = this.styles.cross;
          renderCross(ctx, x, y - fretUnit / 3 - nutWidth, fretUnit / 4 * 2);
        } else if (notes[i] === 'o' || notes[i] === 0) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = this.styles.open;
          renderCircle(ctx, x, y - fretUnit / 3 - nutWidth, fretUnit / 4, true);
        } else if (!!notes[i]) {
          ctx.fillStyle = this.styles.dot;
          y += -yshift / 2 + yshift * notes[i];
          renderCircle(ctx, x, y, fretUnit / 3, false);
        }
        ctx.restore();
      }

      ctx.restore();
    },

    /**
     * #style(Object/String key, [String val])
     *  - Sets the specific style of the chord symbol.
     *    *key* can either be a table of styles or a style-key
     *    *val* is only used if key is a string
     **/
    style: function(key, val) {
      // A table of style values
      if (typeof key === 'object') {
        for (var i in key) {
          if (key.hasOwnProperty(i)) {
            this.styles[i] = key[i];
          }
        }
      } else if (key in this.styles) {
        // Just a single style value
        this.styles[key] = val;
      }
    }
  };

  var Corda = {
    symbol: function(notes, options) {
      if (typeof notes === 'string') {
        var strings, i;

        notes = notes.split('.');
        strings = notes.length;
        for (i = 0; i < strings; i++) {
          notes[i] = notes[i].split('/');
          notes[i] = (notes[i].length === 1) ?
            notes[i][0] : {note: notes[i][0], text: notes[i][1]};
        }

        options = options || {};
        options.strings = strings;
        options.notes = notes;
      } else if (typeof notes === 'object') {
        options = notes;
      }

      return new CordaSymbol(options);
    },

    style: function(key, val) {
      // A table of style values
      if (typeof key === 'object') {
        for (var i in key) {
          if (key.hasOwnProperty(i)) {
            this.styles[i] = key[i];
          }
        }
      } else if (key in this.styles) {
        // Just a single style value
        this.styles[key] = val;
      }
    },

    styles: {
      string: '#000000',
      fret: '#000000',
      nut: '#000000',
      dot: '#000000',
      open: '#000000',
      font: 'Times',
      cross: '#000000'
    }
  };

  Corda.CordaSymbol = CordaSymbol;
  window.Corda = Corda;
})();
