Template.masterLayout.helpers({
  branding: function() {
    return  Branding.find();
  },
  brandingOptions: function() {
    var brandingCount  = Branding.find().count();
    return brandingCount > 0;
  }
})

Template.masterLayout.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
};
