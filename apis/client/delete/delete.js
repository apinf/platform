import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { Router } from 'meteor/iron:router';

Template.deleteApiConfirmation.events({
  'click #modal-delete-api': function (event, instance) {
    // Get API ID
    const apiId = instance.data.api._id;

    // Route to catalogue
    Router.go('catalogue');

    Meteor.call('removeApiBackend', apiId, () => {
      // Dismiss the confirmation modal
      Modal.hide('deleteApiConfirmation');

      // Get success message translation
      const message = TAPi18n.__('deleteApiConfirmation_successMessage');

      // Alert the user of success
      sAlert.success(message + instance.data.api.name);
    });
  },
});
