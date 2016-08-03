Template.masterLayout.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
};

Template.masterLayout.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
  }
});
