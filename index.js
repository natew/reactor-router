var UrlPattern = require('url-pattern');
var Invariant  = require('react/lib/invariant');

var Router = {
  componentWillMount: function() {
    this.setRoute(this.props.path);
    this.shouldUpdate = true;
  },

  componentWillReceiveProps: function(props) {
    if (!props.path) return;
    this.setRoute(props.path);
    this.shouldUpdate = false;

    // Allow a callback to do things before changing pages
    if (typeof this.routerPageChange == 'function')
      this.routerPageChange(function() {
        this.shouldUpdate = true;
        this.forceUpdate();
      }.bind(this));
    else
      this.shouldUpdate = true;
  },

  setRoute: function(path) {
    if (this.route && path === this.props.path)
      return this.route;
    this.route = Router.getRoute(path);
    return this.route;
  },

  setRoutes: function(routes) {
    if (this._routes) return; // already set
    this._routesHash = routes;
    this._routes = Object.keys(routes).map(function(path) {
      return { path: path, to: routes[path] };
    });
  },

  getRoute: function(path) {
    if (!this._routes) this.setRoutes();

    Invariant(
      this._routes,
      'Please run setRoutes() with a routes hash \
      before calling getRoute()'
    );

    var path = path || window.location.pathname;
    var i, len = this._routes.length;

    for (i = 0; i < len; i++) {
      var route = this._routes[i];
      route.pattern = route.pattern || UrlPattern.newPattern(route.path);
      match = route.pattern.match(path);
      if (match) {
        return { page: route.to, params: match };
      }
    }

    // return 404 page
    return { page: this._routesHash['404'] };
  },

  getPage: function(path) {
    return this.getRoute(path).page;
  },

  getParams: function(path) {
    return this.getRoute(path, true).params;
  },

  replaceParams: function(path, params) {
    if (path.indexOf(':') !== -1)
      for (var key in params)
        path = path.replace(':' + key, params[key]);

    return path;
  },

  rootUrl: function() {
    if (this._rootUrl) return this._rootUrl;

    try {
      var protocol = (this.props.protocol || window.location.protocol) + '//';
    }
    catch(e) {
      var protocol = 'http://';
    }

    var port = this.props.port ? ':' + this.props.port : '';
    var host = this.props.host || window.location.host;
    this._rootUrl = protocol + host + port;
    return this._rootUrl;
  }
};

module.exports = Router;