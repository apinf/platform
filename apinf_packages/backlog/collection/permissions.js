/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ApiBacklogItems from './';

ApiBacklogItems.allow({
  insert (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    const apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const apiBackend = Apis.findOne(apiBackendId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanManage();
  },
  update (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    const apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const apiBackend = Apis.findOne(apiBackendId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanManage();
  },
  remove (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    const apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    const apiBackend = Apis.findOne(apiBackendId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanManage();
  },
});
