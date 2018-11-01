/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { sAlert } from 'meteor/juliancwirko:s-alert';

Meteor.startup(() => {
  let config;
  if (Meteor.isClient) {
    config = sAlert.config({
      effect: 'stackslide',
      position: 'bottom-right',
      timeout: 10000,
      html: false,
    });
  }
  return config;
});
