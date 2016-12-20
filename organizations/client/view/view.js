import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection/';


Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the Organization slug from the route
  instance.organizationSlug = FlowRouter.getParam('slug');

  // Subscribe to APIs
  instance.subscribe('allApiBackends', Meteor.userId());
  // Subscribe to a single Organization
  instance.subscribe('singleOrganization', instance.organizationSlug);
});

Template.organizationProfile.helpers({
  organization () {
    // Get single Organization
    return Organizations.findOne();
  },
  managedApis () {
    // Find relate organization document
    const organization = Organizations.findOne();

    // Get organization id
    const organizationId = organization._id;

    return Apis.find({ organizationId }).fetch();
  },
  managedApisCount () {
    // Find relate organization document
    const organization = Organizations.findOne();

    // Get organization id
    const organizationId = organization._id;
    return Apis.find({ organizationId }).count();
  },
});
