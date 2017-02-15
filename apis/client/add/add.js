// Collection imports
import Apis from '../../collection';

Template.addApi.onCreated(function () {
  const instance = this;

  // Subscribe to all organizations, returns only id and name
  instance.subscribe('allOrganizationBasicDetails');
});

Template.addApi.helpers({
  ApisCollection () {
    // Make APIs collection available to template (i.e. autoform)
    return Apis;
  },
});
