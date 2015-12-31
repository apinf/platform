Router.route("/settings", {
  layout: "masterLayout",
  template: "settings",
}, {
  name: "settings"
});

Router.route("/api/new/advanced", function () {
  this.layout("masterLayout");
  this.render("apiBackendForm");
}, {
  name: "addApiBackend-advanced"
});

Router.route("/api/new/simple", function () {
  this.render("addApiBackendWizard");
  this.layout("masterLayout");
}, {
  name: "addApiBackend-simple"
});

Router.route("/api/:_id/edit", function () {
  this.render("apiBackendForm");
  this.layout("masterLayout");
}, {
  name: "editApiBackend"
});

Router.map(function() {
  this.route("home", {
    path: "/",
    layoutTemplate: "homeLayout"
  });

  this.route('search', {
    path: "/search",
    layout: "masterLayout"
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

  this.route("documentation", {
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

  this.route("feedbackList", {
    path: "feedback-list",
    layoutTemplate: "masterLayout",
    render: "feedbacklist"
  });

  this.route("viewApiBackend", {
    path: "/api/:_id/",
    name: "viewApiBackend",
    waitOn: function() {
      // Subscribe to the specific API Backend, by ID
      return this.subscribe('apiBackend', this.params._id);
    },
    data: function () {
      // Get the API Backend from API Backends collection
      var apiBackend = ApiBackends.findOne({_id: this.params._id});

      // Pass the API Backend to the template data context
      return { apiBackend: apiBackend }
    },
    layoutTemplate: "masterLayout",
    render: "viewApiBackend"
  })

  this.route("statusCheck", {
    path: "/status",
    layoutTemplate: "masterLayout",
    render: "statusCheck"
  });

  this.route("accountsAdmin", {
    path: "/users",
    layoutTemplate: "masterLayout",
    render: "accountsAdmin"
  });

  this.route("branding", {
    waitOn: function() {
      return this.subscribe('projectLogo');
    },
    path: "/branding",
    layoutTemplate: "masterLayout",
    render: "branding"
  });
});
