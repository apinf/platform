/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Meteor contributed packages imports
import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import LoginPlatforms from '../collection';

Template.loginPlatforms.onCreated(function () {
  const instance = this;
  instance.autorun(() => {
    // Get Branding collection content
    const branding = Branding.findOne();
    // Check if Branding collection and siteTitle are available
    if (branding && branding.siteTitle) {
      // Set the page title
      const pageTitle = TAPi18n.__('loginPlatformsPage_title_loginPlatforms');
      DocHead.setTitle(`${branding.siteTitle} - ${pageTitle}`);
    }
  });
  // Check if there is some changes in Configuration
  // If there are, update the LoginPlatform
  promisifyCall('updateLoginPlatformsFromConfiguration')
  .then(result => {
    if (result) {
      // Get settings form success message translation
      const message = TAPi18n.__('loginPlatformsPageSettingsUpdatedMessage') + result;
      // Alert the user of successful update
      sAlert.success(message);
    }
  })
  .catch(err => {
    if (err) {
      // Get settings form success message translation
      const message = TAPi18n.__('settings_errorMessage');
      // Alert the user of successful save
      sAlert.error(message, { timeout: 'none' });
    }
  });

  // Subscription to feedback collection
  instance.subscribe('loginPlatforms');
});

Template.loginPlatforms.helpers({
  loginPlatformsCollection () {
    // Return reference to LoginPlatform collection, for AutoForm
    return LoginPlatforms;
  },
  formType () {
    if (LoginPlatforms.findOne()) {
      // Updating existing LoginPlatform
      return 'update';
    }
    // Editing LoginPlatform
    return 'insert';
  },
  editDoc () {
    return LoginPlatforms.findOne();
  },
});
