A tiny router, can be used as a mixin with React components.

Used in [reactor-core](http://github.com/nate/reactor-core).

Component can implement `routerPageChange` as a function to do things between
page changes like grab a new state or animate.

Sets `this.route`, an object with `page` and `params`.