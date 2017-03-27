/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
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
