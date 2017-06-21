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
import $ from 'jquery';

Template.addEmqUser.events({
  'submit #add-emq-user-form': function (event, templateInstance) {
    // Prevent default form submit
    event.preventDefault();

    // Get emqProxy object from template instance
    const emqProxy = templateInstance.data.emqProxy;
    // Get EMQ HTTP API URL from EMQ Proxy
    const emqHttpApi = emqProxy.emq.httpApi;

    // Get username and password values
    const username = $('#emq-user-username').val();
    const password = $('#emq-user-password').val();

    // Check if values are present
    if (username && password) {
      // Call method to add user to EMQ proxy
      Meteor.call('addEmqUser', emqHttpApi, { username, password }, (err, res) => {
        if (err) sAlert.error(err.message);

        // Check if user has really been added to EMQ
        if (res.username === username) {
          // Get reactive variable instance
          const emqUsersReactive = templateInstance.data.emqUsersReactive;
          // Get emq users data from reactive variable
          const emqUsers = emqUsersReactive.get();

          // Push created user to all users
          emqUsers.push(res);

          // Update reactive variable, in order to update UI that lists emq users
          templateInstance.data.emqUsersReactive.set(emqUsers);

          // Hide modal
          Modal.hide('addEmqUser');

          // Get i18n success message
          const successMessage =
          TAPi18n.__('proxyBackendForm_emqProxyForm_addEmqUser_successMessage');
          // Show success message
          sAlert.success(successMessage);
        }
      });
    } else {
      // Get i18n success message
      const errorMessage =
      TAPi18n.__('proxyBackendForm_emqProxyForm_addEmqUser_errorMessage');
      // Show error message
      sAlert.error(errorMessage);
    }
  },
});
