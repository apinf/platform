/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

import '/apinf_packages/organizations/logo/client/view.html';

Template.viewOrganizationLogo.helpers({
  uploadedOrganizationLogoLink () {
    // Get Organization from template data
    const organization = Template.currentData().organization;

    // Return Organization logo or default file URL
    return organization.logoUrl() || '/img/placeholder-logo.jpg';
  },
});
