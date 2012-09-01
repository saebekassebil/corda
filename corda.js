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
    this.fret = options.fret || 0;
    this.notes = options.notes;
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
    render: function(canvas) {
      var   ctx = canvas.getContext('2d')
          , height = canvas.height
          , width = canvas.width
          , frets = 6
          , fretUnit = height / frets
          , marginWidth = fretUnit / 2
          , marginTop = fretUnit
          , symbolWidth = width - 2 * marginWidth - 1
          , symbolHeight = height - marginTop - 1
          , strings = 6
          , nutWidth = fretUnit / 4
          , i, x, xshift, y, yshift;

      ctx.save();

      // Strings
      ctx.lineWidth = 1;
      xshift = symbolWidth / (strings - 1);
      ctx.strokeStyle = this.styles.string;
      for (i = 0; i < strings; i++) {
        ctx.beginPath();
        x = marginWidth + i * xshift;
        ctx.moveTo(x, marginTop);
        ctx.lineTo(x, height);
        ctx.closePath();
        ctx.stroke();
      }

      // Frets
      yshift = symbolHeight / (frets - 1); 
      ctx.strokeStyle = this.styles.fret;
      for (i = 0; i < frets; i++) {
        ctx.save();
        y = marginTop + i * yshift;

        if (this.fret === 0 && i === 0) {
          ctx.strokeStyle = this.styles.nut;
          ctx.lineWidth = nutWidth;
        }

        ctx.beginPath();
        ctx.moveTo(marginWidth, y);
        ctx.lineTo(width - marginWidth, y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      // Notes
      var notes = this.notes;
      y = marginTop / 2;
      for (i = 0; i < notes.length; i++) {
        ctx.save();
        x = marginWidth + i * xshift;
        if (notes[i] === 'x') {
          ctx.lineWidth = 2;
          ctx.strokeStyle = this.styles.cross;
          renderCross(ctx, x, y - nutWidth / 2, fretUnit / 3 * 2);
        } else if (notes[i] === 'o' || notes[i] === 0) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = this.styles.open;
          renderCircle(ctx, x, y - nutWidth / 2, fretUnit / 3, true);
        } else {
          ctx.fillStyle = this.styles.dot;
          renderCircle(ctx, x, y + fretUnit * notes[i], fretUnit / 3, false);
        }
        ctx.restore();
      }

      ctx.restore();
    }
  };

  var Corda = {
    symbol: function(options) {
      return new CordaSymbol(options);
    },

    style: function(key, val) {
      // A table of style values
      if (typeof key === 'object') {
        for (var i in key) {
          if (key.hasOwnProperty(i)) {
            Corda.styles[i] = key[i];
          }
        }
      } else if (key in Corda.styles) {
        // Just a single style value
        Corda.styles[key] = val; 
      }
    },

    styles: {
      string: '#000000',
      fret: '#000000',
      nut: '#000000',
      dot: '#000000',
      open: '#000000',
      text: '#ffffff',
      cross: '#000000'
    }
  };
  
  Corda.CordaSymbol = CordaSymbol;
  window.Corda = Corda;
})();
