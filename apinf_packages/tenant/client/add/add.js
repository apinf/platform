/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.tenantForm.events({
  'click #save-tenant': function () {
    console.log('save tenant this=', this)
    if ($('#add-tenant-name').val() === '') {
      sAlert.error('Tenant must have a name!', { timeout: 'none' });
    } else if ($('#add-tenant-description').val() === '') {
      sAlert.error('Tenant must have a description!', { timeout: 'none' });
    } else {
      const tenant = {};
      let users = [];

      tenant.name = $('#add-tenant-name').val();
      // Empty tenant name field
      $('#add-tenant-name').val('');

      tenant.description = $('#add-tenant-description').val();
      // Empty tenant name field
      $('#add-tenant-description').val('');

      // Get possible users in tenant
      if (Session.get('tenantUsers')) {
        const tenantUsers = Session.get('tenantUsers');
        console.log('tenantUsers=', tenantUsers);
        // convert user objects to a list
        users = tenantUsers.map((userdata) => {
          const usersRow = {
            id: userdata.id,
            name: userdata.username,
            provider: userdata.provider === 'checked' ? 'data-provider' : false,
            customer: userdata.customer === 'checked' ? 'data-customer' : false,
          };
          return usersRow;
        });
        // Empty the tenant user list
        tenantUsers.splice(0, tenantUsers.length);
        // Remove users from session
        Session.set('tenantUsers', tenantUsers);
      }

      // Add possible users to tenant object
      tenant.users = users;

      // Set local tenant list empty
      let tenantList = [];

      console.log('call addTenant');
      // POST /tenant
      Meteor.call('addTenant', tenant, (error, result) => {
        if (result) {
          console.log(+new Date(), ' 2 a result=', result);
          if (Response.statusCode === 201) {
            // New tenant successfully added on manager side, empty local list
            tenantList = [];
          } else {
            // Tenant addition failure on manager side, save new tenant object to local array
            tenantList.unshift(tenant);
          }
        } else {
          console.log(+new Date(), ' 2 b error=', error);
          // Tenant addition failure on manager side, save new tenant object to local array
          tenantList.unshift(tenant);
        }
      });      

      // Save to sessionStorage to be used while adding users to tenant
      Session.set('tenantList', tenantList);

      // Close modal
      Modal.hide('tenantForm');

    }
  },
});

Template.tenantUserForm.helpers({
  completeUserList () {
  //  const completeUserList = Session.get('completeUserList');
  //  return completeUserList;
    return Session.get('completeUserList');;
  },
});
