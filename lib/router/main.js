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

  this.route("manageApiBackends", {
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
    path: "/documentation",
    layoutTemplate: "masterLayout"
  });

  this.route("apiDocumentationEditor", {
    path: "/documentation/editor",
    layoutTemplate: "masterLayout"
  });

  this.route("importApiConfiguration", {
    path: "import/api",
    layoutTemplate: "masterLayout",
    render: "importApiConfiguration"
  });

  this.route("editApiBackend", {
    path: "/api/:_id/edit",
    waitOn: function() {
      return this.subscribe('apiBackend', this.params._id);
    },
    data: function () {
      var apiBackend = ApiBackends.findOne({_id: this.params._id});
      return { apiBackend: apiBackend }
    },
    layoutTemplate: "masterLayout",
    render: "editApiBackend"
  })

    this.route("viewApiBackend", {
    path: "/api/:_id/view",
    waitOn: function() {
      return this.subscribe('apiBackend', this.params._id);
    },
    data: function () {
      var templateDate = ApiBackends.findOne({_id: this.params._id});
      return { apiBackend: templateDate }
    },
    layoutTemplate: "masterLayout",
    render: "viewApiBackend"
  })

  this.route("statusCheck", {
    path: "/status",
    layoutTemplate: "masterLayout",
    render: "statusCheck"
  })
  
});
