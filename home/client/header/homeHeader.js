import { Proxies } from '/proxies/collection'
import { Branding } from '/branding/collection';
import { ProjectLogo } from '/branding/logo/collection';

Template.homeHeader.onCreated(function() {
  const instance = this;
  // Subscribe to project logo
  instance.subscribe('projectLogo');
  instance.subscribe('publicProxyDetails');
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
    const branding = this.branding;
    if (branding) {
      const currentProjectLogoFileId = branding.projectLogoFileId;
      return true;
    }
  },
  proxyIsDefined () {
    return (Proxies.findOne()) ? true : false;
  }
});
