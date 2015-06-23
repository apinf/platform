Router.map(function() {
  this.route("home", {
    path: "/",
    layoutTemplate: "homeLayout"
  });
  this.route("apiBackends", {
    path: "/apibackends",
    layoutTemplate: "homeLayout"
  });
  this.route("dashboard", {
    path: "/dashboard",
    layoutTemplate: "chartLayout",
    data: function() {
      return {
        vals: val.get()
      };
    }
  });
});
