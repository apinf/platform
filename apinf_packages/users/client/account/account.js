/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Branding from '/apinf_packages/branding/collection';

Template.account.onCreated(function () {
	// Get reference to template instance
  const instance = this;

  instance.autorun(() => {
     // Get Branding collection content
    const branding = Branding.findOne();
    // Check if Branding collection and siteTitle are available
    if (branding && branding.siteTitle) {
      // Set the page title
      const pageTitle = TAPi18n.__('accountPage_title_account');
      DocHead.setTitle(`${branding.siteTitle} - ${pageTitle}`);
    }
  });
});

Template.account.events({
  'click #delete-account-button': function () {
    // Show the delete account modal
    Modal.show('deleteAccount');
  },
});
