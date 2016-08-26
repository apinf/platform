

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

  this.route("apiDocumentationEditor", {
    path: "/documentation/editor",
    layoutTemplate: "masterLayout"
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

  this.route("notAuthorized", {
    path: "/not-authorized",
    layoutTemplate: "masterLayout",
    render: "notAuthorized"
  });
});
