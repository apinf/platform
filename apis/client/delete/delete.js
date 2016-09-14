import { Apis } from '/apis/collection';


Template.deleteApiBackendConfirmation.events({
  'click #deleteApi': function (event, instance) {
    // Get API ID
    const apiId = instance.data._id;

    Meteor.call('removeApiBackend', apiId, (error) => {
      if (error) {
        console.log(error);
      } else {
        // Route to catalogue
        Router.go('catalogue');

        // Get success message translation
        const message = TAPi18n.__('deleteApiBackendConfirmation_successMessage');

        // Alert the user of success
        sAlert.success(message + instance.data.name);

        // Dismiss the confirmation modal
        Modal.hide();
      }
    });
  },
});
