/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ProxyBackends from './';

ProxyBackends.allow({
  insert (userId, backend) {
    // Only allow API Managers or Administrators to insert

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    return (api && api.currentUserCanManage());
  },
  update (userId, backend) {
    // Only allow API Managers or Administrators to update

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    return (api && api.currentUserCanManage());
  },
  remove (userId, backend) {
    // Only allow API Managers or Administrators to remove

    // Get API document
    const api = Apis.findOne(backend.apiId);

    // Check if current user can edit API
    return (api && api.currentUserCanManage());
  },
});
