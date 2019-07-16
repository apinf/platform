/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.authorizationForm.onRendered(() => {
  $('#tenant-helpIcon').popover({
    html: true,
  });
});

Template.authorizationForm.helpers({
  tenantToken () {
    const tenantTokenObj = Session.get('tenantTokenObj');

    if (tenantTokenObj) {
      const str = JSON.stringify(tenantTokenObj, null, 4);
      return str;
    }
    return false;
  },
});

Template.authorizationForm.events({
  'click #refreshTenantAuthorization': function () {
    // Get processing message translation
    const message = TAPi18n.__('apiKeys_getApiKeyButton_processing');

    const tenantPassword = $('#tenantPasswordInput').val();

    if ($('#tenantPasswordInput').val() === '') {
      sAlert.error('Enter password', { timeout: 'none' });
    } else {
      // Set bootstrap loadingText
      $('#refreshTenantAuthorization').button({ loadingText: message });

      // Set button to processing state
      $('#refreshTenantAuthorization').button('loading');

      Meteor.call('getTenantTokenObj', tenantPassword, (error, result) => {
        if (error) {
          sAlert.error(error);
        } else if (result.response && result.response.data.error === 'invalid_grant') {
          // Show error
          sAlert.error('Incorrect password.');

          // Reset processing button
          $('#refreshTenantAuthorization').button('reset');
        } else {
          // Get success message translation
          const successMessage = 'We have successfully got you a new token!';

          // Alert the user of success
          sAlert.success(successMessage);

          // Reset processing button
          $('#refreshTenantAuthorization').button('reset');

          Session.set('tenantTokenObj', result.data);
        }
      });

      $('#tenantPasswordInput').val('');
    }
  },
  'click .toggle-password': function () {
    // Show and hide password
    $('.toggle-password').toggleClass('mdi-eye mdi-eye-off');

    const input = $('#tenantPasswordInput');

    return input.attr('type') === 'password' ?
    input.attr('type', 'text') : input.attr('type', 'password');
  },
});
