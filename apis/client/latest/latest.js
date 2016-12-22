import { Apis } from '/apis/collection';
import moment from 'moment';

Template.latestApis.created = function () {

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
  instance.subscribe("latestPublicApis", limit);

  // Attach cursor function to a template instance
  instance.latestApiBackendsCursor = function () {
    // Get a cursor for API Backends documents limited by provided value and sorted by created date
    return ;
  }

};

Template.latestApis.helpers({
  'latestApis': function (limit) {
    // Retrieve last API Backends
    return Apis.find({}, { sort: { created_at: -1}}).fetch();
  }
});
