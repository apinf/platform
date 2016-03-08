Template.deleteApiBackendConfirmation.helpers({
  'apiBackend': function() {
    Session.set("apiBackendId", this._id);
    return ApiBackends.findOne(this._id).name;
  }
});

Template.deleteApiBackendConfirmation.events({
  'click #deleteApi': function() {
    const apiBackendId = Session.get("apiBackendId");
    ApiBackends.remove(apiBackendId);
    Meteor.call('removeApiBackendOnApiUmbrella', function(error, apiUmbrellaWebResponse) {

      //alert(apiUmbrellaWebResponse.errors.default);

      if (apiUmbrellaWebResponse.http_status === 200) {
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
    Router.go('catalogue');
  }
});
