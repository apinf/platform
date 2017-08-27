/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Models imports
import Organizations from '/apinf_packages/organizations/collection';

Template.organizationFeaturedApis.onCreated(() => {
  // Get reference to template instance
  const instance = this;
  
  // Get the API Backend ID from the route
  const slug = FlowRouter.getParam('slug');

  // Look for Organization
  instance.organization = Organizations.findOne({ slug });
    
});

Template.organizationFeaturedApis.helpers({
  userIsAdminOrOrganizationManager(){
    // Get reference to template instance
    const instance = Template.instance();

    // Get organization managerIds in template
    const managerIds = instance.data.organization.managerIds;

    // Check if user is admin
    const userIsAdmin = Roles.userIsInRole(Meteor.userId(), ['admin']);

    // Check if user is manager
    const userIsManager = managerIds.includes(Meteor.userId());

    return userIsAdmin || userIsManager;
  }
});