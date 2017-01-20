// Import Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
// Import apinf collections
import CoverPhoto from '/branding/cover_photo/collection';
import { Settings } from '/settings/collection';
import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection';


Template.homeBody.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to settings publication
  instance.subscribe('singleSetting', 'mail.enabled');
  // Subscribe to CoverPhoto collection
  instance.subscribe('coverPhoto');

  instance.subscribe('apis_Count');
  //instance.subscribe('organizations_Count');

});

Template.homeBody.rendered = function () {
  $('.contact-us-link').click(function () {
    document.getElementById('contact-us').scrollIntoView();
  });

Template.homeBody.helpers({
  getapiscount(){
    return Counts.get('apiscounts');
  },
//  getorganizationscount(){
  //  return Counts.get('organizationscounts');
  //},
  contactFormEnabled () {
    const settings = Settings.findOne();

    // Placeholder for mail enabled Check
    let mailEnabled;

    // Check if mail is enabled
    if (settings && settings.mail && settings.mail.enabled) {
      mailEnabled = true;
    }

    return mailEnabled;
  },
  coverPhotoUrl () {
    // Get Branding collection
    const branding = this.branding;

    // Check Branding collection and cover photo exist
    if (branding && branding.coverPhotoFileId) {
      // Get ID
      const currentCoverPhotoFileId = branding.coverPhotoFileId;

      // Convert to Mongo ObjectID
      const objectId = new Mongo.Collection.ObjectID(currentCoverPhotoFileId);

      // Check if cover photo file is available
      const currentCoverPhotoFile = CoverPhoto.findOne(objectId);

      // Check if cover photo file is available
      if (currentCoverPhotoFile) {
        // Get cover photo file URL
        return Meteor.absoluteUrl().slice(0, -1) + CoverPhoto.baseURL + '/md5/' + currentCoverPhotoFile.md5;
      }
    }
    return '';
  },
});
