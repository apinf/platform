/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';

// Npm packages imports
import _ from 'lodash';

Template.apiSettingsDetails.onDestroyed(() => {
  // Unset Session variable
  Session.set('apiLogoUploading', undefined);
});

Template.apiSettingsDetails.onRendered(function () {
  // Fetch other Url
  const apiDocs = ApiDocs.findOne();
  const links = _.get(apiDocs, 'otherUrl', []);
  Session.set('links', links);

  this.autorun(() => {
    const getLinks = Session.get('links');
    if (getLinks) {
      if (getLinks.length >= 8) {
        const message = TAPi18n.__('manageApiDocumentationModal_ToolTip_Message');
        $('#link-value').attr('disabled', true);
        $('#add-link').attr('disabled', true);
        $('#link-value').attr('title', message);
      } else {
        // If Session data is less than 8
        $('#link-value').attr('disabled', false);
        $('#add-link').attr('disabled', false);
        $('#link-value').attr('title', '');
      }
    }
  });
});


Template.apiSettingsDetails.helpers({
  apisCollection () {
    return Apis;
  },
  apiLogoUploading () {
    // Get status of logo uploading
    return Session.get('apiLogoUploading');
  },
  otherUrls () {
    // Return Session
    return Session.get('links');
  },

});

Template.apiSettingsDetails.events({
  'click #save-documentation-link': function () {
    // Hide modal
    Modal.hide('manageApiDocumentationModal');
  },
  'click #add-link': function () {
    // Get Value from textbox
    const link = $('#link-value').val().trim();
    // Regex for https protocol
    const regex = SimpleSchema.RegEx.Url;
    const regexUrl = regex.test(link);
    // If value is https(s)
    if (regexUrl) {
      // make error message invisible
      $('#errorMessage').addClass('invisible');
      const linksData = Session.get('links');
      // If data is available in Session
      if (linksData) {
        linksData.push(link);
        Session.set('links', linksData);
      }
      // clear the text box
      $('#link-value').val('');
    } else {
      // Hide error message
      $('#errorMessage').removeClass('invisible');
    }
  },

  'click .delete-link': function (event) {
    // get links from session
    const otherUrlLinks = Session.get('links');
    // get cross id
    const deleteLinkId = event.currentTarget.id;
    if (otherUrlLinks) {
    // Remove elemnt from Session
      otherUrlLinks.splice(deleteLinkId, 1);
      Session.set('links', otherUrlLinks);
    }
  },
});
