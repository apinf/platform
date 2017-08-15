/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/imports/apis/collection';
import { MonitoringSettings } from './';

MonitoringSettings.allow({
  insert (userId, data) {
    // Only allow API Managers or Administrators to insert

    // Get API document
    const api = Apis.findOne(data.apiId);

    // Check if current user can insert the monitoring settings and return this value
    return api && api.currentUserCanManage();
  },
  update (userId, data) {
    // Only allow API Managers or Administrators to update

    // Get API document
    const api = Apis.findOne(data.apiId);

    // Check if current user can edit the monitoring settings and return this value
    return api && api.currentUserCanManage();
  },
  remove (userId, data) {
    // Only allow API Managers or Administrators to remove

    // Get API document
    const api = Apis.findOne(data.apiId);

    // Check if current user can delete the monitoring settings and return this value
    return api && api.currentUserCanManage();
  },
});
