// Meteor packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';

Template.organizationCard.onCreated(function () {
  // Get reference to template instance
  const instance = this;
  // Get organizationId
  const organizationId = this.data.organization._id;
  // Subscribe to organization APIs count
  instance.subscribe('organizationApisCount', organizationId);
});

Template.organizationCard.helpers({
  organzationApisCount () {
    // Get reference to template instance
    const instance = Template.instance();
    // Get Organization Id
    const organizationId = instance.data.organization._id;
    // Get a count of Organization APIs
    return Counts.get(`organizationApisCount-${organizationId}`);
  },
});
