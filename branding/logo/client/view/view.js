// Meteor packages imports
import Branding from '/branding/collection';
import ProjectLogo from '/branding/logo/collection';

Template.viewProjectLogo.onCreated(function () {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
  instance.subscribe('branding');
});

Template.viewProjectLogo.helpers({
  uploadedProjectLogoLink () {
    // TODO: Copy & pasted from Template.uploadProjectLogo.helpers.
    const currentProjectLogoFileId = this.branding.projectLogoFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(currentProjectLogoFileId);

    // Get project logo file Object
    const currentProjectLogoFile = ProjectLogo.findOne(objectId);

    let projectLogoFileUrl;
    // Check if project logo file is available
    if (currentProjectLogoFile) {
      // Get Meteor absolute URL
      const meteorAbsoluteUrl = Meteor.absoluteUrl().slice(0, -1);

      const baseProjectLogoFotoUrl = meteorAbsoluteUrl + ProjectLogo.baseURL;
      // Get project logo file URL
      projectLogoFileUrl = `${baseProjectLogoFotoUrl}/md5/${currentProjectLogoFile.md5}`;
    }
    return projectLogoFileUrl;
  },
  projectLogoExists () {
    const branding = Branding.findOne();

    return !!(branding.projectLogoFileId);
  },
});
