/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import ApiBookmarks from './';

ApiBookmarks.schema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  apiIds: {
    type: [String],
    optional: true,
    defaultValue: [],
});

ApiBookmarks.attachSchema(ApiBookmarks.schema);
