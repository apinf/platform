import { Apis } from '/apis/collection';
import { ApiBacklogItems } from '/backlog/collection';

Template.viewApiBackend.onCreated(function () {
  // Get reference to template instance
  var instance = this;

  // Get the API Backend ID from the route
  apiBackendId = Router.current().params._id;

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", apiBackendId);

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe("apiBacklogItems", apiBackendId);
});

Template.viewApiBackend.helpers({
  "apiBackend": function () {
    // Get the API Backend ID from the route
    let apiBackendId = Router.current().params._id;

    // Get single API Backend
    let apiBackend = Apis.findOne(apiBackendId);

    return apiBackend;
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
