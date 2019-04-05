/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

Template.tenantUsersList.helpers({
  tenantUsers () {
    // Form list of tenant users
    const tenantUsers = Session.get('tenantUsers');
    return tenantUsers;
  },
  isMailEnabled () {
    if (Session.get('mailStatusResponse')) {
      return Session.get('mailStatusResponse');
    } else {
      return false;
    }
  },
});

Template.tenantUsersList.events({
  'click .remove-tenant-user': function () {
    let tenantUsers = [];
    // Get possible previous users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = Session.get('tenantUsers');
    }

    // find object to be removed
    const tenantRemoveIndex = tenantUsers.findIndex(user => {
      return user.id === this.id;
    });
    // Remove user object from array of tenants
    tenantUsers.splice(tenantRemoveIndex, 1);

    // Save to localStorage to be used while listing users of tenant
    Session.set('tenantUsers', tenantUsers);
  },
  'change .tenantUserRoleConsumer': function (event) {
    let tenantUsers = [];
    // Get possible previous users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = Session.get('tenantUsers');
    }

    // update user's role, consumer
    tenantUsers = tenantUsers.map(user => {
      if (user.id === this.id) {
        user.consumer = event.currentTarget.checked ? 'checked' : false;
      }
      return user;
    });

    // Save to localStorage to be used while listing users of tenant
    Session.set('tenantUsers', tenantUsers);
  },
  'change .tenantUserRoleProvider': function (event) {
    let tenantUsers = [];
    // Get possible previous users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = Session.get('tenantUsers');
    }

    // update user's role, provider
    tenantUsers = tenantUsers.map(user => {
      if (user.id === this.id) {
        user.provider = event.currentTarget.checked ? 'checked' : false;
      }
      return user;
    });

    // Save to localStorage to be used while listing users of tenant
    Session.set('tenantUsers', tenantUsers);
  },
  'change .notificationToUser': function (event) {
    let tenantUsers = [];
    // Get list of users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = Session.get('tenantUsers');
    }

    // update user's notification grant
    tenantUsers = tenantUsers.map(user => {
      if (user.id === this.id) {
        user.notification = event.currentTarget.checked ? 'checked' : false;
      }
      return user;
    });

    // Save to localStorage to be used while user roles change
    Session.set('tenantUsers', tenantUsers);
  },
});
