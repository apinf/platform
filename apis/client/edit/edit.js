import { Apis } from '/apis/collection';

Template.editApi.created = function () {
  // Get reference to current Router
  var router = Router.current();

  // Get the API Backend ID from Router
  var apiBackendId = router.params._id;

  if (apiBackendId) {
    // Subscription to apiBackends collection
    this.subscribe('apiBackend', apiBackendId);
  }
};

Template.editApi.helpers({
  'apiBackend': function () {
    // Get the current Router
    var router = Router.current();

    // Check router for _id parameter
    if (router.params._id) {
      // Get the API Backend ID
      var apiBackendId = router.params._id;

      // Get the API Backend
      var apiBackend = Apis.findOne(apiBackendId);

      return apiBackend;
    }
  }
});
