/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import moment from 'moment';


Template.authorizationForm.helpers({
  tenantToken () {
    // Get user id
    const userId = Meteor.userId();
    const user = Meteor.users.findOne(userId);

    if (user && user.services && user.services.fiware) {
      return user.services.fiware.accessToken;
    }
    return false;
  },
  tenantTokenExpiration () {
    // Get user id
    const userId = Meteor.userId();
    const user = Meteor.users.findOne(userId);

    if (user && user.services && user.services.fiware) {
      // emphasize expiration date if it has passed
      let effect;
      if (moment() > user.services.fiware.expiresAt) {
        effect = 'font-weight: bold; color: red;';
      }
      // Get current language
      const language = TAPi18n.getLanguage();
      // Return timestamp and effect
      return {
        expirationTime: moment(user.services.fiware.expiresAt).locale(language),
        expirationEffect: effect,
      } 
    }
    return false;
  },
  tenantRefreshToken () {
    // Get user id
    const userId = Meteor.userId();
    const user = Meteor.users.findOne(userId);

    if (user && user.services && user.services.fiware) {
      return user.services.fiware.refreshToken;
    }
    return false;
  },
});

Template.authorizationForm.events({
  'click #refreshTenantAuthorization': function () {
    console.log('Here will be auth refresh!')
  },

});
