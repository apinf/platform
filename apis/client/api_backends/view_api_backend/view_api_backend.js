Template.viewApiBackend.created = function () {
  // Get reference to template instance
  var instance = this;

  // Get the API Backend ID from the route
  apiBackendId = Router.current().params._id;

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", apiBackendId);

  // Subscribe to metadata for this API Backend
  instance.subscribe("apiMetadata", apiBackendId);

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe("apiBacklogItems", apiBackendId);
};

Template.viewApiBackend.helpers({
  "apiBackend": function () {
    // Get the API Backend ID from the route
    let apiBackendId = Router.current().params._id;

    // Get single API Backend
    let apiBackend = ApiBackends.findOne(apiBackendId);

    return apiBackend;
  },
  "metadata": function () {
    // Get the API Backend ID from the route
    let apiBackendId = Router.current().params._id;

    // Get API Backend metadata
    let apiMetadata = ApiMetadata.findOne({apiBackendId});

    return apiMetadata;
  },
  backlogItems: function () {
    // Get the API Backend ID from the route
    let apiBackendId = Router.current().params._id;

    // Fetch all backlog items for a specific API Backend
    // Sort by priority value and created date
    var backlogItems = ApiBacklogItems.find({apiBackendId: apiBackendId }, {sort: {priority: -1, createdAt: -1}}).fetch();

    return backlogItems;
  }
});
