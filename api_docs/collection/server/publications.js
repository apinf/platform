/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */


import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import ApiDocs from '/api_docs/collection';

Meteor.publish('apiDocs', (apiId) => {
  // Make sure apiId is a String
  check(apiId, String);

  // returning documenation object for current API
  return ApiDocs.find({ apiId });
});
