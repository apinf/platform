Template.deleteApiBackendConfirmation.onCreated(function() {
  // reference to this template
  const instance = this;

  // instance variables
  instance.backendId = instance.data._id;
  instance.backendName = instance.data.name;
  instance.restCallStarted = new ReactiveVar(false);
});



Template.deleteApiBackendConfirmation.helpers({
  'savedBackendName': function() {

    const instance = Template.instance();
    return instance.backendName;
  },

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

      if (apiUmbrellaWebResponse.http_status === 204) {

        // call method to remove API backend from collections
        Meteor.call('removeApiBackend', apiBackendId);

        $('#confirmDelete').hide(function() {
          $('#successDelete').removeClass('hide');
        });

        // based on name of current route, load suitable parent page
        var currentRoute = Router.current().route.getName();

        if (currentRoute === 'viewApiBackend') {
          Router.go('catalogue');
        } else if (currentRoute === 'manageApiBackends') {
          Router.go('manageApiBackends');
        }

      } else {
        $('#confirmDelete').hide(function() {
          $('#failureDelete').removeClass('hide');
        });
      }

      // REST call ended, stop spinner
      instance.restCallStarted.set(false);

      $('#confirmFooter').hide(function() {
        $('#doneFooter').removeClass('hide');
      });
    });
  }
});



