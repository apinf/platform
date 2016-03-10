Template.deleteApiBackendConfirmation.helpers({
  // save the API backend name and ID in session variables
  'apiBackend': function() {
    Session.set('apiBackendId', this._id);
    const apiBackendName = ApiBackends.findOne(this._id).name;
    Session.set('apiBackendName', apiBackendName);
    return apiBackendName;
  },
  // return saved API name to be displayed in success/error message.
  // The API backend name is saved separately so that it can be 
  // used even after the backend has been deleted.
  'savedBackendName': function() {
    return Session.get('apiBackendName');
  }

});

Template.deleteApiBackendConfirmation.events({
  'click #deleteApi': function() {
    const apiBackendDoc = ApiBackends.findOne(Session.get("apiBackendId"));
    const apiUmbrellaApiId = apiBackendDoc.id;
    const apiBackendId = Session.get("apiBackendId");

    //Meteor.call('removeApiBackend', apiBackendId);

    // REST call to Admin API for deletion from Umbrella
    Meteor.call('deleteApiBackendOnApiUmbrella', apiUmbrellaApiId, function(error, apiUmbrellaWebResponse) {

      if (apiUmbrellaWebResponse.http_status === 204) {

        // call method to remove API backend from collections
        Meteor.call('removeApiBackend', apiBackendId);

        $('#confirmDelete').hide(function() {
          $('#successDelete').removeClass('hide');
        });
        $('#confirmFooter').hide(function() {
          $('#successFooter').removeClass('hide');
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
        $('#confirmFooter').hide(function() {
          $('#failureFooter').removeClass('hide');
        });
      }

    });
  },

  'click #closeModal': function() {
    Modal.hide();
  }
});



