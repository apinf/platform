Template.latestApiBackends.created = function () {

  // Reference to Template instance
  var instance = this;

  // Subscribe to a publication
  instance.subscribe("latestApiBackends");

  // Cursor
  instance.latestApiBackendsList = function () {
    return ApiBackends.find({}, {sort: {created_at: -1}, limit: 6});
  }

};

Template.latestApiBackends.helpers({
  'latestBackends': function () {

    // Reference to Template instance
    var instance = Template.instance();

    // Retrieve 6 last API Backends
    var latestApiBackendsList = instance.latestApiBackendsList().fetch();

    // Iterate through all documents
    _.each(latestApiBackendsList, function (apiBackend) {

      // Return to user human-readable timestamp
      apiBackend.relative_created_at = moment(apiBackend.created_at).fromNow();
    });

    return latestApiBackendsList;
  }
});
