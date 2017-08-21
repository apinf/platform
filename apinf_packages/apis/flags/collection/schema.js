/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ApiFlags from './';

ApiFlags.schema = new SimpleSchema({
  reason: {
    type: String,
    allowedValues: [
      TAPi18n.__('flagApiSchema_inappropriateText'),
      TAPi18n.__('flagApiSchema_DefunctText'),
    ],
  },
  comments: {
    type: String,
    autoform: {
      rows: 5,
    },
  },
  createdBy: {
    type: String,
    autoValue () {
      let value;
      // Check if the field is not already set
      if (!this.isSet) {
        // Autofill current user id
        value = Meteor.userId();
      }
      return value;
    },
  },
  apiBackendId: {
    type: String,
    autoValue () {
      let value;
      // Check if the field is not already set
      if (!this.isSet) {
        // Autofill current api backend id
        value = FlowRouter.current().params._id;
      }
      return value;
    },
  },
});

ApiFlags.attachSchema(ApiFlags.schema);
