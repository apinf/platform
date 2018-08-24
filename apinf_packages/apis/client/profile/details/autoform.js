/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { AutoForm } from 'meteor/aldeed:autoform';

AutoForm.hooks({
  apiDetailsForm: {
    formToModifier: (doc) => {
      const host = 'https://';
      if (doc.$set.url.substring(0, 8) !== host) {
        doc.$set.url = host + doc.$set.url;
        return doc;
      }
      return doc;
    },
  },
});
