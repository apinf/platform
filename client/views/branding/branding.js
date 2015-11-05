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
    return ProjectLogo.find({}, {sort: {uploadedAt: -1}}).fetch()[0];
  },
  projectLogoDefault: function () {
    // Count user's feedback in feedback collection
    var projectLogoCount  = ProjectLogo.find().count();
    return projectLogoCount > 0;
  }
});



