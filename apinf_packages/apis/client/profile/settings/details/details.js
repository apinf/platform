/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

Template.apiSettingsDetails.onDestroyed(() => {
  // Unset Session variable
  Session.set('apiLogoUploading', undefined);
});

Template.apiSettingsDetails.helpers({
  apisCollection () {
    return Apis;
  },
  apiLogoUploading () {
    // Get status of logo uploading
    return Session.get('apiLogoUploading');
  },
});
