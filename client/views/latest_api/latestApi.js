Template.latestApiBackends.helpers({
  'latestBackends': function (limit) {

    // Subscribe to a publication
    Meteor.subscribe("latestApiBackends");

    // Retrieve the latest API Backends by given limit parameter
    var latestApiBackends = ApiBackends.find({}, {sort: {created_at: -1}, limit: limit}).fetch();

    // Iterate through all documents
    _.each(latestApiBackends, function (api) {

      // Return to user human-readable timestamp
      api.relative_created_at = moment(api.created_at).fromNow();
    });

    return latestApiBackends;
  }
});
