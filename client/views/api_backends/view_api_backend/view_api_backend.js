Template.viewApiBackend.created = function () {
  // Get reference to template instance
  var instance = this;

  // Get the API Backend ID from the route
  apiBackendId = Router.current().params._id;

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", apiBackendId);
};

Template.viewApiBackend.helpers({
  "apiBackend": function () {
    // Get the API Backend ID from the route
    let apiBackendId = Router.current().params._id;

    // Get single API Backend
    let apiBackend = ApiBackends.findOne(apiBackendId);

    return apiBackend;
  }
});
