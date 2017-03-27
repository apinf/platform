/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import OrganizationApis from '../../collection';

Template.organizationApisForm.helpers({
  formType () {
    // Get reference to tempplate instance
    const instance = Template.instance();

    // Get Organization API document from template data context
    const organizationApi = instance.data.organizationApi;

    // If Organization API doc exists, type is update, otherwise type is insert
    if (organizationApi) {
      return 'update';
    }

    return 'insert';
  },
  organizationApisCollection () {
    return OrganizationApis;
  },
});
