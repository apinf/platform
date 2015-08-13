Router.map(function() {
  this.route("home", {
    path: "/",
    layoutTemplate: "homeLayout"
  });

  this.route("apiBackends", {
    path: "/apibackends",
    layoutTemplate: "masterLayout"
  });

  this.route("catalogue", {
    path: "/catalogue",
    layoutTemplate: "masterLayout"
  });

  this.route("apiBackendManager", {
    path: "/manage",
    layoutTemplate: "masterLayout"
  });

  this.route("bookmarks", {
    path: "/bookmarks",
    layoutTemplate: "masterLayout"
  });

  this.route("map", {
    path: "/map",
    layoutTemplate: "masterLayout"
  });

  this.route("dashboard", {
    path: "/dashboard",
    layoutTemplate: "masterLayout"
  });

  this.route("swagger", {
    path: "/swagger",
    layoutTemplate: "masterLayout"
  });

  this.route("importApiConfiguration", {
    path: "import/api",
    layoutTemplate: "masterLayout",
    render: "importApiConfiguration"
  });
});
