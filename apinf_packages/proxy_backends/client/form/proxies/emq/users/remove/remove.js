/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import _ from 'lodash';

Template.removeEmqUser.events({
  'click #remove-emq-user': function (event, templateInstance) {
    // Get user data to be added, from template instance
    const user = templateInstance.data.user;
    // Get emq proxy data from template instance
    const emqProxy = templateInstance.data.emqProxy;

    // Get HTTP API URL from emq proxy
    const emqHttpApi = emqProxy.emq.httpApi;

    // Call method to remove emq user
    Meteor.call('removeEmqUser', emqHttpApi, user.id, (err, res) => {
      if (err) sAlert.error(err.message, { timeout: 'none' });

      // Check if user has really been added to EMQ
      if (res.id === user.id) {
        // Get reactive variable instance
        const emqUsersReactive = templateInstance.data.emqUsersReactive;
        // Get emq users data from reactive variable
        const emqUsers = emqUsersReactive.get();

        // Remove user from the users list
        _.remove(emqUsers, (emqUser) => {
          return emqUser.id === user.id;
        });

        // Update reactive variable, in order to update UI that lists emq users
        templateInstance.data.emqUsersReactive.set(emqUsers);

        // Hide modal
        Modal.hide('removeEmqUser');

        // Get i18n success message
        const successMessage =
        TAPi18n.__('proxyBackendForm_emqProxyForm_removeEmqUser_successMessage');
        // Show success message
        sAlert.success(successMessage);
      }
    });
  },
});
