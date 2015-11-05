Template.masterLayout.helpers({
  brandingOptions: function() {
    return Branding.find();
  }
})

Template.masterLayout.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
};
