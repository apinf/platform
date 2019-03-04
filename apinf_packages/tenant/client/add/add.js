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
import { TAPi18n } from 'meteor/tap:i18n';

Template.tenantForm.events({
  'click #save-tenant': function (event) {
    console.log('save tenant this=', this);
    console.log('save tenant event=', event);
    if ($('#add-tenant-name').val() === '') {
      sAlert.error('Tenant must have a name!', { timeout: 'none' });
    } else if ($('#add-tenant-description').val() === '') {
      sAlert.error('Tenant must have a description!', { timeout: 'none' });
    } else {
      const tenant = {};
      let tenantUsers = [];

      tenant.name = $('#add-tenant-name').val();
      tenant.description = $('#add-tenant-description').val();

      // Get possible users in tenant
      if (Session.get('tenantUsers')) {
        tenantUsers = Session.get('tenantUsers');
        console.log('tenantUsers=', tenantUsers);
        // convert user objects to a list
        tenant.users = tenantUsers.map((userdata) => {
          const usersRow = {
            id: userdata.id,
            name: userdata.name,
            provider: userdata.provider === 'checked' ? 'data-provider' : false,
            customer: userdata.customer === 'checked' ? 'data-customer' : false,
          };
          return usersRow;
        });
      }

      // Set local tenant list empty
      let tenantList = [];

      console.log('call addTenant with =', tenant);
      // POST /tenant
      Meteor.call('addTenant', tenant, (error, result) => {
        if (result) {
          console.log(+new Date(), ' 2 a result=', result);
          if (result.status === 201) {
            // In successful case we can empty the input fields

            // Empty the tenant user list
            tenantUsers.splice(0, tenantUsers.length);
            // Remove users from session
            Session.set('tenantUsers', tenantUsers);

            // Empty tenant name field
            $('#add-tenant-name').val('');
            // Empty tenant description field
            $('#add-tenant-description').val('');

            // New tenant successfully added on manager side, empty local list
            tenantList = [];
            // Save to sessionStorage to be used while adding users to tenant
            Session.set('tenantList', tenantList);

            // Close modal
            Modal.hide('tenantForm');

            // Get success message translation
            let message = TAPi18n.__('tenantForm_addTenant_Success_Message');
            message = message.concat(tenant.name);

            // Alert user of success
            sAlert.success(message);
          } else {
            // Tenant addition failure on manager side, save new tenant object to local array
            const errorMessage = `Tenant manager error! Returns code (${result.status}).`;
            sAlert.error(errorMessage, { timeout: 'none' });
            // tenantList.unshift(tenant);
          }
        } 
        if (error) {
          console.log(+new Date(), ' 2 b error=', error);
          // Tenant addition failure on manager side, save new tenant object to local array
          const errorMessage = `Tenant operation failed!  (${error}).`;
          sAlert.error(errorMessage, { timeout: 'none' });
          // tenantList.unshift(tenant);
        }
      });
    }
  },
  'click #update-tenant-description': function () {
    const thisTenant = this;
    console.log('update tenant this=', thisTenant);
    if ($('#add-tenant-description').val() === '') {
      sAlert.error('Tenant must have a description!', { timeout: 'none' });
    } else {
      const tenant = {
        id: thisTenant.tenantToModify.id,
        op: 'replace',
        value: $('#add-tenant-description').val(),
        path: '/description',
      };

      console.log('update Tenant=', tenant);
      // PATCH /tenant
      Meteor.call('updateTenant', tenant, (error, result) => {
        if (result) {
          console.log(+new Date(), ' 2 a result=', result);
          if (result.status === 200) {
            // Get success message translation
            const message = TAPi18n.__('tenantForm_description_Success_Message');
            // Alert user of success
            sAlert.success(message);
          } else {
            // Tenant update failure on manager side
            let errorMessage = TAPi18n.__('tenantForm_description_Failure_Message');
            errorMessage = errorMessage.concat(result);
            sAlert.error(errorMessage, { timeout: 'none' });
          }
        } else {
          console.log(+new Date(), ' 2 b error=', error);
          // Tenant addition failure on manager side, save new tenant object to local array
          let errorMessage = TAPi18n.__('tenantForm_description_Failure_Message');
          errorMessage = errorMessage.concat(error);
          sAlert.error(errorMessage, { timeout: 'none' });
        }
      });
    }
  },
  'click #modify-tenant': function () {
    const originalTenant = this.tenantToModify;
    console.log('original tenant=', originalTenant);
    if ($('#add-tenant-description').val() === '') {
      sAlert.error('Tenant must have a description!', { timeout: 'none' });
    } else {
      // initiate the array for changes
      let modifyTenantPayload = {};
      modifyTenantPayload.body = [];

      console.log('orig tenant=', originalTenant);

      // The changed tenant
      const modifiedTenant = {
        name: originalTenant.name,
        id: originalTenant.id,
        description: $('#add-tenant-description').val(),
      };

      // Get possible users in changed tenant
      if (Session.get('tenantUsers')) {
        tenantUsers = Session.get('tenantUsers');
        console.log('tenantUsers=', tenantUsers);
        // convert user objects to a list
        modifiedTenant.users = tenantUsers.map((userdata) => {
          const usersRow = {
            id: userdata.id,
            name: userdata.name,
            provider: userdata.provider,
            customer: userdata.customer,
          };
          return usersRow;
        });
      }

      console.log('modified tenant=', modifiedTenant);

      // Any changes in description
      if (originalTenant.description !== modifiedTenant.description) {
        modifyTenantPayload.id = originalTenant.id;
        const changedDescription = {
          op: 'replace',
          value: $('#add-tenant-description').val(),
          path: '/description',
        };
        modifyTenantPayload.body.push(changedDescription);
      }

      // Any changes in users
      let userChanges = originalTenant.users.map((origUser, index) => {
        console.log('origUser=', origUser);
        // Check if same user present in modified data
        const sameUserInModified = modifiedTenant.users.filter((user, modifiedIndex) => {
          console.log('mod user=', user);
          // Return modified user if found
          if (user.id === origUser.id) {
            console.log('found match=', user.id);
            return true;
          }
        });

        console.log('sameusers=', sameUserInModified);
        console.log('origUser.prov=', origUser.provider);
        console.log('mod.prov=', sameUserInModified[0].provider);
        console.log('origUser.cust=', origUser.customer);
        console.log('mod.cust=', sameUserInModified[0].customer);
        // If not found in modified user list, so user is removed
        // Or if user data is modified, at first remove
        if (sameUserInModified.length === 0 ||
            origUser.customer !== sameUserInModified[0].customer ||
            origUser.provider !== sameUserInModified[0].provider) {
          modifyTenantPayload.id = originalTenant.id;
          let path = '/users/';
          // indicate user with original user data index
          path = path.concat(index);
          const removedUser = {
            op: 'remove',
            path: path,
          };
          console.log('removeduser=', removedUser);
          return removedUser;
        } 

        // If user data is modified, add user with new data
        if (origUser.customer !== sameUserInModified[0].customer ||
            origUser.provider !== sameUserInModified[0].provider) {
          modifyTenantPayload.id = originalTenant.id;

          // collect roles
          const tenantRoles = [];
          if (sameUserInModified[0].provider) {
            tenantRoles.push('data-provider');
          }
          if (sameUserInModified[0].customer) {
            tenantRoles.push('data-customer');
          }
  
          // collect user data
          const value = {
            id: sameUserInModified[0].id,
            name: sameUserInModified[0].name,
            roles: tenantRoles
          };

          const addedUser = {
            op: 'add',
            path: '/users/-',
            value: value,
          };

          // remove handled user from modified list
          modifiedTenant.users = modifiedTenant.users.splice(modifiedIndex, 1);
          console.log('mod.users=', modifiedTenant.users);

          console.log('addedUser=', addedUser);
          return addedUser;
        } 


        return false;
      });

      console.log('userChanges=', userChanges);
      if (userChanges) {
        modifyTenantPayload.body.push(userChanges);
      }
/*
      // Convert parameters to array in tenant manager API from internal object
      const userlist = modifyTenantPayload.users.map(user => {
        const tenantRoles = [];
        if (user.provider) {
          tenantRoles.push('data-provider');
        }
        if (user.customer) {
          tenantRoles.push('data-customer');
        }
        return {
          id: user.id,
          name: user.name,
          roles: tenantRoles,
        };
      });      

      modifyTenantPayload.users = userlist;
*/

      console.log('update Tenant payload=', modifyTenantPayload);
      // PATCH /tenant
      Meteor.call('updateTenantX', modifyTenantPayload, (error, result) => {
        if (result) {
          console.log(+new Date(), ' 2 a result=', result);
          if (result.status === 200) {
            // Get success message translation
            const message = TAPi18n.__('tenantForm_description_Success_Message');
            // Alert user of success
            sAlert.success(message);
          } else {
            // Tenant update failure on manager side
            let errorMessage = TAPi18n.__('tenantForm_description_Failure_Message');
            errorMessage = errorMessage.concat(result);
            sAlert.error(errorMessage, { timeout: 'none' });
          }
        } 
        if (error) {
          console.log(+new Date(), ' 2 b error=', error);
          // Tenant addition failure on manager side, save new tenant object to local array
          let errorMessage = TAPi18n.__('tenantForm_description_Failure_Message');
          errorMessage = errorMessage.concat(error);
          sAlert.error(errorMessage, { timeout: 'none' });
        }
      });
    }
  },
});
