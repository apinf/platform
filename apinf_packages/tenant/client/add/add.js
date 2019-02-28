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
  'click #save-tenant': function () {
    console.log('save tenant this=', this);
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

      console.log('call addTenant');
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
        } else {
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

});
