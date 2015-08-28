Template.viewApiBackend.created = function() {
  // Create reference to instance
  var instance = this;
  
  // Get the API Backend ID from the route
  var backendId = Router.current().params.apiBackendId;
  
  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", backendId);
}
