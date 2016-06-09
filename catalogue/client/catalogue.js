Template.catalogue.onCreated(function (){
  this.subscribe('allApiBackends');
});

Template.catalogue.helpers({
  apiBackends: function () {
    // Return cursor to all apiBackends
    return ApiBackends.find();
  }
});
