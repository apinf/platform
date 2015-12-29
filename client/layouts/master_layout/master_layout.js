Template.masterLayout.helpers({
  branding: function() {
    var theme = Branding.find();
    if (theme) {
      return theme
    }
  },
  projectLogo: function () {
    var lastUploadedLogo = ProjectLogo.findOne({}, {sort: {uploadedAt: -1}});
    if (lastUploadedLogo) {
      return lastUploadedLogo
    }
  }
});

Template.masterLayout.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
  // Subscription to projectLogo collection
  this.subscribe('projectLogo');
};
