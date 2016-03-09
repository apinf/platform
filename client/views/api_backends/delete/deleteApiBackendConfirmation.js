Template.deleteApiBackendConfirmation.helpers({
  'apiBackend': function() {
    Session.set("apiBackendId", this._id);
    return ApiBackends.findOne(this._id).name;
  }
});

Template.deleteApiBackendConfirmation.events({
  'click #deleteApi': function() {
    const apiBackendId = Session.get("apiBackendId");
    const apiBackendDoc = ApiBackends.findOne(Session.get("apiBackendId"));
    const userId = Meteor.user()._id;

    ApiBackends.remove(apiBackendId);

    ApiBackends.after.remove(function(userId, apiBackendDoc) {
      ApiBacklogItems.remove({apiBackendId:apiBackendDoc._id});
      Feedback.remove({apiBackendId: apiBackendId});
      ApiMetadata.remove({apiBackendId: apiBackendId});
      ApiDocs.remove({apiBackendId: apiBackendId});
    });

    Meteor.call('deleteApiBackendOnApiUmbrella', apiBackendId, function(error, apiUmbrellaWebResponse) {
    
      alert(apiUmbrellaWebResponse.errors.default);

      if (apiUmbrellaWebResponse.http_status === 204) {
        $('#confirmDelete').hide(function() {
          $('#successDelete').removeClass('hide');
        });
        $('#confirmFooter').hide(function() {
          $('#successFooter').removeClass('hide');
        });
      }
    });
  },

  'click #closeModal': function() {
    const str = Router.current().location.get().path();
    if (str.search('api') >= 0) {
      Router.go('catalogue');
    } else if (str.search('manage') >= 0) {
      Router.go('manageApiBackends');
    }
  }
});
