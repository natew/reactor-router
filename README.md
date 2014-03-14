This is a tiny router that is made to fit in with a React root level component.

Used in [reactor-core](http://github.com/nate/reactor-core).

The component that uses this as a mixin should use the `this.shouldUpdate` for shouldComponentUpdate like so:

    shouldComponentUpdate: function() {
      this.shouldUpdate;
    }