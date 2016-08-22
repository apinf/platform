Router.map(function() {

  this.route("settingsWizard", {
    path: "/settingsWizard",
    layoutTemplate: "masterLayout",
    render: "settingsWizard"
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
