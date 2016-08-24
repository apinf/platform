import { Apis } from '/apis/collection';
import moment from 'moment';

Template.latestApiBackends.created = function () {

  // Reference to Template instance
  var instance = this;
  var limit;
  // Limit for latest Api Backends passed to the template
  if ( instance.data && instance.data.limit ) {
    limit = instance.data.limit;
  } else {
    // Set default limit 8
    limit = 8;
  }

  // Subscribe to latestApiBackends publication & pass limit parameter
  instance.subscribe("latestApiBackends", limit);

  // Attach cursor function to a template instance
  instance.latestApiBackendsCursor = function () {
    // Get a cursor for API Backends documents limited by provided value and sorted by created date
    return Apis.find({}, { sort: { created_at: -1}, limit: limit });
  }

};

Template.latestApiBackends.helpers({
  'latestBackends': function (limit) {

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
