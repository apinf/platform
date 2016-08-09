import { ProjectLogo } from '/logo/collection/collection';

Template.homeHeader.onCreated(function() {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
  // Subscription to branding collection
  instance.subscribe('branding');
});

Template.homeHeader.helpers({
  uploadedProjectLogoLink: function() {

    const currentProjectLogoFileId = Branding.findOne().projectLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentProjectLogoFileId);

    // Get project logo file Object
    const currentProjectLogoFile = ProjectLogo.findOne(objectId);

    // Check if project logo file is available
    if (currentProjectLogoFile) {
      // Get API logo file URL
      return Meteor.absoluteUrl().slice(0, -1) + ProjectLogo.baseURL + "/md5/" + currentProjectLogoFile.md5;
    }
  },
  projectLogoExists: function () {
    const currentProjectLogoFileId = this.branding.projectLogoFileId;

    if (currentProjectLogoFileId) {
      return true;
    }
  }
});
