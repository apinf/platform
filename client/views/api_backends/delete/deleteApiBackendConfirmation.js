Template.deleteApiBackendConfirmation.onCreated(function() {
  // reference to this template
  const instance = this;

  // instance variables
  instance.backendId = instance.data._id;
  instance.backendName = instance.data.name;
  instance.restCallStarted = new ReactiveVar(false);
});



Template.deleteApiBackendConfirmation.helpers({

  /* This holds the API backend name for showing the confirmation
     to the user, even after it has been deleted. */
  'savedBackendName': function() {

    const instance = Template.instance();
    return instance.backendName;
  },

  /* this helper is needed to display a spinner on the template 
     after the user has pressed Delete. The instance.restCallStarted
     instance variable is set to True when the button
     is pressed. The spinner starts and continues until the call returns.*/
  'restCallStarted': function() {
    const instance = Template.instance();
    return instance.restCallStarted.get();
  }
});

Template.deleteApiBackendConfirmation.events({
  'click #deleteApi': function() {
    const instance = Template.instance();
    const apiBackendDoc = ApiBackends.findOne(instance.backendId);
    const apiUmbrellaApiId = apiBackendDoc.id;

    // Disable delete button to prevent multiple clicks
    $('#deleteApi').prop("disabled", true);

    // start spinner when calling API
    instance.restCallStarted.set(true);

    // REST call to Admin API for deletion from Umbrella
    Meteor.call('deleteApiBackendOnApiUmbrella', apiUmbrellaApiId, function(error, apiUmbrellaWebResponse) {

      // 204 is the HTTP response code when the API has been successfully removed in the umbrella
      if (apiUmbrellaWebResponse.http_status === 204) {

        // Publish changes made to the deleted API to the Umbrella
        Meteor.call('publishApiBackendOnApiUmbrella', apiUmbrellaApiId, function(error, apiUmbrellaWebResponse) {

          // Changes to API backend successfully deleted
          if (apiUmbrellaWebResponse.http_status == 201) {

            // call method to remove API backend from collections
            Meteor.call('removeApiBackend', instance.backendId);

            // based on name of current route, load suitable parent page
            const currentRoute = Router.current().route.getName();

            if (currentRoute == 'viewApiBackend') {
              // Go to catalogue page
              Router.go('catalogue');
            }

            // Wait for template to render before showing alert to user
            setTimeout(function () {
              sAlert.success(instance.backendName + " was successfully deleted!");
            }, 1000);
          } else {
              sAlert.error("Changes to " + instance.backendName + " could not be published!" );
          }
        });

      } else {
        sAlert.error(instance.backendName + " could not be deleted!");
      }
      Modal.hide();

      // REST call ended, stop spinner
      instance.restCallStarted.set(false);

    });
  }
});
