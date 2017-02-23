import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import ApiDocs from '/api_docs/collection';

Meteor.publish('apiDocs', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  // returning documenation object for current API
  return ApiDocs.find({ apiId });
});
