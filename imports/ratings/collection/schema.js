/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import ApiBackendRatings from './';

ApiBackendRatings.schema = new SimpleSchema({
  apiBackendId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  rating: {
    type: Number,
    min: 0,
    max: 4,
  },
});

ApiBackendRatings.attachSchema(ApiBackendRatings.schema);
