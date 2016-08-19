Router.route("/settings", {
  layout: "masterLayout",
  template: "settings",
}, {
  name: "settings"
});

Router.map(function() {

  this.route("settingsWizard", {
    path: "/settingsWizard",
    layoutTemplate: "homeLayout",
    render: "settingsWizard"
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

  this.route("branding", {
    path: "/branding",
    layoutTemplate: "masterLayout",
    render: "branding"
  });
});
