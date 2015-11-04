Template.branding.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
};

Template.branding.helpers({
  branding: function () {
    return Branding.findOne();
  }
});
