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
});

Template.tenantUsersList.events({
  'click .remove-tenant-user': function () {
    const selected = this;
    let tenantUsers = [];
    // Get possible previous users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = Session.get('tenantUsers');
    }

    // find object to be removed
    const tenantRemoveIndex = tenantUsers.findIndex(user => {
      return user.username === selected.username &&
             user.customer === selected.customer &&
             user.provider === selected.provider;
    });
    // Remove user object from array of tenants
    tenantUsers.splice(tenantRemoveIndex, 1);

    // Save to localStorage to be used while listing users of tenant
    Session.set('tenantUsers', tenantUsers);
  },
  'change .tenantUserRoleCustomer': function (event, templateInstance) {
    const selected = this;
    console.log('click this=', selected);
    console.log('event=', event);
    console.log('templateInstance=', templateInstance);

    let customerStatus = false;
    if ($('#tenantUserRoleCustomer').is(':checked')) {
      console.log('customeri päälle');
      customerStatus = 'data-customer';
      // Checkbox is checked.
    } else {
      console.log('customeri pois päältä');
        // Checkbox is not checked.
    }

    let tenantUsers = [];
    // Get possible previous users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = Session.get('tenantUsers');
    }

    // update user's role, customer
    tenantUsers = tenantUsers.map(user => {
      if (user.id === this.id) {
        user.customer = customerStatus;
      }
      return user;
    });

    // Save to localStorage to be used while listing users of tenant
    Session.set('tenantUsers', tenantUsers);

    console.log('tenantusers=', tenantUsers);
  },
  'change .tenantUserRoleProvider': function () {
    const selected = this;
    console.log('click this=', selected);

    let providerStatus = false;
    if ($('#tenantUserRoleProvider').is(':checked')) {
      console.log('provideri päälle');
      providerStatus = 'data-customer';
      // Checkbox is checked.
    } else {
      console.log('provideri pois päältä');
        // Checkbox is not checked.
    }
    let tenantUsers = [];
    // Get possible previous users of tenant
    if (Session.get('tenantUsers')) {
      tenantUsers = Session.get('tenantUsers');
    }

    // update user's role, customer
    tenantUsers = tenantUsers.map(user => {
      if (user.id === this.id) {
        user.provider = providerStatus;
      }
      return user;
    });

    // Save to localStorage to be used while listing users of tenant
    Session.set('tenantUsers', tenantUsers);

    console.log('tenantusers=', tenantUsers);

  },
  
    
});
