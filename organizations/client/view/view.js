import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Organizations } from '../../collection/';

Template.singleOrganization.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the Organization slug from the route
  instance.organizationSlug = FlowRouter.getParam('slug');

  // Subscribe to a single Organization
  instance.subscribe('singleOrganization', instance.organizationSlug);
});

Template.singleOrganization.helpers({
  organization () {
    // Get single Organization
    const organization = Organizations.findOne();

    return organization;
  },
});
