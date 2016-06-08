Router.route("/settings", {
  layout: "masterLayout",
  template: "settings",
}, {
  name: "settings"
});

Router.route("/api/new/:step?", function () {
  this.render("addApiBackendWizard");
  this.layout("masterLayout");
}, {
  name: "addApiBackend-wizard"
});

Router.route("/api/:_id/edit", function () {
  this.render("editApiBackend");
  this.layout("masterLayout");
}, {
  name: "editApiBackend"
});

Router.map(function() {

  this.route("settingsWizard", {
    path: "/settingsWizard",
    layoutTemplate: "homeLayout",
    render: "settingsWizard"
  });

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
    layoutTemplate: "masterLayout",
    render: "viewApiBackend"
  });

  this.route("apiBacklog", {
    path: "/api/:_id/backlog",
    layoutTemplate: "masterLayout",
    render: "apiBacklog"
  });

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
    path: "/branding",
    layoutTemplate: "masterLayout",
    render: "branding"
  });

  this.route("notAuthorized", {
    path: "/not-authorized",
    layoutTemplate: "masterLayout",
    render: "notAuthorized"
  });
});
