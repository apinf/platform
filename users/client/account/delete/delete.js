/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.deleteAccount.events({
  'click #delete-account-confirm': function () {
    // Get user ID
    const userId = Meteor.userId();

    // Delete user account
    Meteor.call('deleteAccount', userId, () => {
      // Dismiss the delete account modal
      Modal.hide('deleteAccount');

      // Get deletion message success translation
      const message = TAPi18n.__('deleteAccount_success_message');

      // Alert user of successful deletion, dont clear on route change
      sAlert.success(message, { onRouteClose: false });

      // Route to home page
      FlowRouter.go('home');
    });
  },
});
