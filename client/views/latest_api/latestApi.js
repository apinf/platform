Template.latestApiBackends.helpers({
  'latestBackends': function () {

    // Subscribe to a publication
    Meteor.subscribe("latestApiBackends");

    // Retrieve 6 last API Backends
    var latestApiBackends = ApiBackends.find({}, {sort: {created_at: -1}, limit: 6}).fetch();

    // Iterate through all documents
    _.each(latestApiBackends, function (api) {

      // Return to user human-readable timestamp
      api.relative_created_at = moment(api.created_at).fromNow();
    });

    return latestApiBackends;
  }
});
