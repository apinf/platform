Router.route("/api/new", function () {
  this.render("addApi");
  this.layout("masterLayout");
}, {
  name: "addApi"
});

Router.route("/api/:_id/", function () {
  // Save a reference to route, for use inside method callback function
  const route = this;

  // Get current API Backend ID
  const apiBackendId = Router.current().params._id;

  // Ensure current user is authorized to view backend
  Meteor.call("currentUserCanViewApi", apiBackendId, function (error, userIsAuthorized) {
    if (userIsAuthorized) {
      route.render("viewApiBackend");
      route.layout("masterLayout");
    } else {
      Router.go("notAuthorized");
    }
  });
},{
  name: "viewApi",
});

Router.route("/api/:_id/edit", function () {
  // Save a reference to route, for use inside method callback function
  const route = this;

  // Get current API Backend ID
  const apiBackendId = Router.current().params._id;

  // Ensure current user is authorized to view backend
  Meteor.call("currentUserCanEditApi", apiBackendId, function (error, userIsAuthorized) {
    if (userIsAuthorized) {
      route.render("viewApiBackend");
      route.layout("masterLayout");
    } else {
      Router.go("notAuthorized");
    }
  });
}, {
  name: "editApi"
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

  //this.route();

  this.route("apiBacklog", {
    path: "/api/:_id/backlog",
    layoutTemplate: "masterLayout",
    render: "apiBacklog"
  });
});
