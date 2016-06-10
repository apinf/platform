Template.apiCatalogue.created = function () {

  // Reference to Template instance
  var instance = this;

  // Subscribe to latestApiBackends publication & pass limit parameter
  instance.subscribe("latestApiBackends");
  instance.subscribe("allBookmarks");

  // Attach cursor function to a template instance
  instance.apiBackendsCursor = function () {
    // Get a cursor for API Backends documents
    return ApiBackends.find({});
  }

};

Template.apiCatalogue.helpers({
  'apiBackends': function () {

    // Reference to Template instance
    var instance = Template.instance();

    // Retrieve API Backends
    var apiBackendsList = instance.apiBackendsCursor().fetch();

    // Iterate through all documents
    _.each(apiBackendsList, function (apiBackend) {

      // Return to user human-readable timestamp
      apiBackend.relative_created_at = moment(apiBackend.created_at).fromNow();
    });

    return apiBackendsList;
  },
  bookmarksCount (apiBackendId) {

    const bookmarkedApis = ApiBookmarks.find({ apiIds: apiBackendId.hash.apiBackendId}).fetch();

    return bookmarkedApis.length;
  }
});
