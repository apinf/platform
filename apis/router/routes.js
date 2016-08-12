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
  this.route("manageApiBackends", {
    path: "/manage",
    layoutTemplate: "masterLayout"
  });

  this.route("importApiConfiguration", {
    path: "import/api",
    layoutTemplate: "masterLayout",
    render: "importApiConfiguration"
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
});
