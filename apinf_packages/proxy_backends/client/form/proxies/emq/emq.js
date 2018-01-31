/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

Template.emqProxyForm.helpers({
  isDisabled () {
    const instance = Template.instance();
    const proxyBackend = instance.data.proxyBackend;
    return proxyBackend && proxyBackend.emq.settings.topicPrefix ? '' : 'disabled-div';
  },
});

Template.emqProxyForm.events({
  'click .autoform-remove-item': function () {
    const message = TAPi18n.__('proxyBackendForm_emqProxyForm_removeAcl_confirmationMessage');
    // Show confirmation dialog to user
    const confirmation = confirm(message);
    // Return users response, It will be either true of false
    return confirmation;
  },
});
