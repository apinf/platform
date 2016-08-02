Template.masterLayout.created = function () {
  // Subscription to branding collection
  this.subscribe('branding');
  // // Subscription to projectLogo collection
  // this.subscribe('projectLogo');
};

Template.masterLayout.helpers({
  branding: function () {
    // Get Branding collection content
    return Branding.findOne();
  // },
  // projectLogo: function () {
  //   // Get last uploaded image from collection
  //   var lastUploadedLogo = ProjectLogo.findOne({}, {sort: {uploadedAt: -1}});
  //
  //   if (lastUploadedLogo) {
  //     return lastUploadedLogo
  //   }
  }
});
