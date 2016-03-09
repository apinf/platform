Template.deleteApiBackendConfirmation.helpers({
  'apiBackend': function() {
    Session.set("apiBackendId", this._id);
    return ApiBackends.findOne(this._id).name;
  }
});

Template.deleteApiBackendConfirmation.events({
  'click #deleteApi': function() {
    const apiBackendDoc = ApiBackends.findOne(Session.get("apiBackendId"));
    const apiUmbrellaApiId = apiBackendDoc.id;
    const userId = Meteor.user()._id;

    const documentId = apiBackendDoc._id;
    Meteor.call('removeApiBackend', userId, apiBackendDoc);

    Meteor.call('deleteApiBackendOnApiUmbrella', apiUmbrellaApiId, function(error, apiUmbrellaWebResponse) {

      if (apiUmbrellaWebResponse.http_status === 204) {
        $('#confirmDelete').hide(function() {
          $('#successDelete').removeClass('hide');
        });
        $('#confirmFooter').hide(function() {
          $('#successFooter').removeClass('hide');
        });
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
    var currentRoute = Router.current().route.getName();
    
    // based on name of current route, load page upon modal closure
    if (currentRoute === 'manageApiBackends') {
      Modal.hide();
    } else if (currentRoute === 'viewApiBackend') {
      Modal.hide();
      Router.go('catalogue');
    }
  }
});



