import { Apis } from '/apis/collection';

Template.apiBacklog.helpers({
  currentUserCanEditBacklog () {
    /*
     API Backlog shares permissions with the API Backend
     Make sure user can edit API Backend before allowing Metadata permissions
    */

    // Get current API backend ID
    const apiId = this.api._id;

    // Find related API Backend that contains "managerIds" field
    const api = Apis.findOne(apiId, { fields: { managerIds: 1 } });

    // Check if current user can edit API Backend
    return api.currentUserCanEdit();
  },
});

Template.apiBacklog.events({
  'click #add-backlog-item': function () {
    // Show Add API Backlog Item modal
    Modal.show('addApiBacklogItem');
  },
});
