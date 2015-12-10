Template.branding.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
};

Template.branding.helpers({
  branding: function () {
    return Branding.findOne();
  }
});


Template.branding.helpers({
  projectLogo: function () {
    var lastUploadedLogo = ProjectLogo.find({}, {sort: {uploadedAt: -1}}).fetch()[0];
    if (lastUploadedLogo) {
      return lastUploadedLogo
    }
  }
});


Template.AdminLTE.helpers({
  skin: function () {
    // Get color theme from branding collection
    var adminLTESkin = Branding.findOne().color_theme;
    // Set chosen AdminLTE skin or use default
    return adminLTESkin || 'blue-light';
  }
});
