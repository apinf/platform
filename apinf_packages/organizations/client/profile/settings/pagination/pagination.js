/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Organizations from '/apinf_packages/organizations/collection/';

Template.organizationSettingsPagination.helpers({
  organizationsCollection () {
    // Make Organizations collection available to template (i.e. autoform)
    return Organizations;
  },
});
