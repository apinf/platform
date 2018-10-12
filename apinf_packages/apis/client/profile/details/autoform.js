/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';

AutoForm.hooks({
  apiDetailsForm: {
    formToModifier: (doc) => {
      const protocol1 = 'https://';
      const protocol2 = 'http://';
      if (doc.$set.url.substring(0, 8) === protocol1) {
        return doc;
      } else if (doc.$set.url.substring(0, 7) === protocol2) {
        return doc;
      } else if (doc.$set.url.substring(0, 8) !== protocol1) {
        doc.$set.url = protocol1 + doc.$set.url;
        return doc;
      }
      return doc;
    },
  },
});
