import { ApiBacklogItems } from './';
import { Apis } from '/apis/collection';

ApiBacklogItems.allow({
  insert: function (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    var apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = Apis.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
  update: function (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    var apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = Apis.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
  remove: function (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    var apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = Apis.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
