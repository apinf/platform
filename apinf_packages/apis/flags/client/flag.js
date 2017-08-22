/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import ApiFlags from '../../collection';

Template.flagApiModal.onCreated(function () {
  // Create reference to instance
  const instance = this;

  // Get apiFlag doc passed to a template
  instance.apiFlag = instance.data.apiFlag;
});

Template.flagApiModal.helpers({
  formType () {
    // Create reference to instance
    const instance = Template.instance();

    // Check if apiFlag exists are return related form action
    return (instance.apiFlag) ? 'update' : 'insert';
  },
  apiFlag () {
    // Create reference to instance
    const instance = Template.instance();

    return instance.apiFlag;
  },
  apiIsFlagged () {
    // Create reference to instance
    const instance = Template.instance();

    // Check if api exists and return boolean
    return !!(instance.apiFlag);
  },
});

Template.flagApiModal.events({
  'click #remove-apiFlag': function () {
    // Create reference to instance
    const instance = Template.instance();

    // Remove ApiFlag and keep response
    const removeApiFlag = ApiFlags.remove({ _id: instance.apiFlag._id });

    // Check if document has been removed
    if (removeApiFlag > 0) {
      // Get success message translation
      const message = TAPi18n.__('flagApiModal_removeApiFlag_successMessage');

      // Show message to a user
      sAlert.success(message);

      // Hide modal
      Modal.hide('flagApiModal');
    }
  },
});
