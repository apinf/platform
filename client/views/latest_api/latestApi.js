Template.latestApiBackends.created = function () {

  // Reference to Template instance
  var instance = this;

  // Documents limit for MongoDB to return (6 docs by default)
  instance.limit = new ReactiveVar(6);

  // Subscribe to a publication
  instance.subscribe("latestApiBackends", instance.limit.get());

  // Cursor
  instance.latestApiBackendsCursor = function () {
    return ApiBackends.find({}, {sort: {created_at: -1}, limit: instance.limit.get()});
  }

};

Template.latestApiBackends.helpers({
  'latestBackends': function () {

    // Reference to Template instance
    var instance = Template.instance();

    // Retrieve last API Backends
    var latestApiBackendsList = instance.latestApiBackendsCursor().fetch();

    // Iterate through all documents
    _.each(latestApiBackendsList, function (apiBackend) {

      // Return to user human-readable timestamp
      apiBackend.relative_created_at = moment(apiBackend.created_at).fromNow();
    });

    return latestApiBackendsList;
  }
});
