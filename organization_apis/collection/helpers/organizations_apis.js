/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
import OrganizationApis from '../';

OrganizationApis.helpers({
  api () {
    // Get api
    const api = Apis.findOne(this.apiId);

    // Return api
    return api;
  },
  organization () {
    // Get organization
    const organization = Organizations.findOne(this.organizationId);

    // Return organization
    return organization;
  },
});
