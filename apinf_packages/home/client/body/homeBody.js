/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';

// Collection imports
import CoverPhoto from '/apinf_packages/branding/cover_photo/collection';
import Settings from '/apinf_packages/settings/collection';


import '/apinf_packages/home/client/contact/contact.js';
import '/apinf_packages/core/client/search_field/search-field.html';
import '/apinf_packages/apis/client/homePageApis/homePageApis.js';
import '/apinf_packages/home/client/body/homeBody.html';

Template.homeBody.onCreated(function () {
  // Get reference to template instance
  const templateInstance = this;

  // Subscribe to settings publication
  templateInstance.subscribe('singleSetting', 'mail.enabled');
  // Subscribe to CoverPhoto collection
  templateInstance.subscribe('coverPhoto');
  // Subscribe to Apis , Organizations and Users collection for statistic block
  templateInstance.subscribe('apisCount');
  templateInstance.subscribe('organizationsCount');
  templateInstance.subscribe('usersCount');
});

Template.homeBody.onRendered = function () {
  $('#contact-us-link').click(() => {
    const contactUs = document.getElementById('contact-us');
    contactUs.scrollIntoView();
  });
};

Template.homeBody.helpers({
  apisCount () {
    return Counts.get('apisCount');
  },

  organizationsCount () {
    return Counts.get('organizationsCount');
  },
  usersCount () {
    return Counts.get('usersCount');
  },
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
        // Get cover photo meteor base URL
        const coverPhotoMeteorBaseUrl = Meteor.absoluteUrl().slice(-1, -1) + CoverPhoto.baseURL;

        // Get cover photo file URL
        return `${coverPhotoMeteorBaseUrl}/md5/${currentCoverPhotoFile.md5}`;
      }
    }
    return '';
  },
});
