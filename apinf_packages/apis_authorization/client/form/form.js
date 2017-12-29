/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// APInf imports
import emailSchema from './schema';

Template.apiUserAuthorizationForm.helpers({
  apiId () {
    // Get API ID
    const apiId = Template.instance().data.api._id;

    return apiId;
  },
  emailSchema () {
    return emailSchema;
  },
});

Template.apiUserAuthorizationForm.events({
  'submit #authorizedUserForm': function (event) {
    // Prevent form from reloading page
    event.preventDefault();
  },
});
