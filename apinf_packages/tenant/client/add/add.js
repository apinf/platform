/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Template.tenantForm.events({
  'click #save-tenant': function (event) {
    if ($('#add-tenant-name').val() === '') {
      sAlert.error('Tenant must have a name!', { timeout: 'none' });
    } else {

      let tenant = {};
      let users = [];

      tenant.name = $('#add-tenant-name').val();
      // Empty tenant name field
      $('#add-tenant-name').val('');

      // Get possible users in tenant
      if (Session.get('tenantUsers')) {
        const tenantUsers = JSON.parse(Session.get('tenantUsers'));
        console.log('tenantUsers=', tenantUsers);
        // convert user objects to a list
        users = tenantUsers.map((userdata) => {
          const usersRow = [];
          usersRow[0] = userdata.username;
          usersRow[1] = userdata.provider || '-';
          usersRow[2] = userdata.consumer || '-';
          return usersRow;

        });
        // Empty the tenant user list
        tenantUsers.splice(0, tenantUsers.length);
        // Remove users from session
        Session.set('tenantUsers', JSON.stringify(tenantUsers));
      }

      // Add possible users to tenant object
      tenant.users = users;
 
      // Read tenant list
      const tenantList = JSON.parse(Session.get('tenantList'));

      // Add new tenant object to array
      tenantList.unshift(tenant);
      console.log('tenant-lista kirjoittumassa=', tenantList);

      // Save to localStorage to be used while adding users to tenant
      Session.set('tenantList', JSON.stringify(tenantList));    

      // Close modal
      Modal.hide('tenantForm');
    }
  },
});

Template.tenantUserForm.helpers({
  completeUserList () {
    console.log('sessio=(', Session.get('completeUserList'),')');
    const completeUserList = JSON.parse(Session.get('completeUserList'));

    console.log('parsittuna=(', completeUserList, ')');
    return completeUserList;
  },
});