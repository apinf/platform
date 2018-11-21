/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import StoredTopics from './';

StoredTopics.schema = new SimpleSchema({
  value: {
    type: String,
    optional: false,
  },
  createdBy: {
    type: String,
    optional: false,
  },
  starred: {
    type: Boolean,
    optional: false,
  },
  createdAt: {
    type: Date,
    optional: false,
  },
});

// Enable translations (i18n)
StoredTopics.schema.i18n('schemas.organizations');

StoredTopics.attachSchema(StoredTopics.schema);
