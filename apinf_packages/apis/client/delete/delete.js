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

Template.deleteApiConfirmation.events({
  'click #modal-delete-api': function (event, templateInstance) {
    // Get API ID
    const apiId = templateInstance.data.api._id;

    // Route to API Catalog
    FlowRouter.go('apiCatalog');

    // Disable delete button
    $('#modal-delete-api').attr('disabled', true);

    Meteor.call('removeApi', apiId, () => {
      // Enable delete button
      $('#modal-delete-api').attr('disabled', false);
      
      // Dismiss the confirmation modal
      Modal.hide('deleteApiConfirmation');

      // Get success message translation
      const message = TAPi18n.__('deleteApiConfirmation_successMessage');

      // Alert the user of success
      sAlert.success(message + templateInstance.data.api.name);
    });
  },
});
