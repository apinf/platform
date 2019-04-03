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

Template.ensureTenantRemovalForm.onCreated(() => {
  // Turn off spinner if it was on
  Session.set('tenantRemoveOngoing', false);
});

Template.ensureTenantRemovalForm.onDestroyed(() => {
  // Unset sessions
  Session.set('tenantRemoveOngoing', undefined);
});

Template.ensureTenantRemovalForm.events({
  'click #remove-tenant-confirmed': function (event) {
    // The button sends the index of tenant to be removed
    const tenantRemoveIndex = $(event.target).data('value');

    // Save new Tenant operation began, inform spinner
    Session.set('tenantRemoveOngoing', true);

    // Read tenant list
    let tenantList = Session.get('tenantList');

    // get selected tenant data
    const tenantToRemove = tenantList[tenantRemoveIndex];

    // DELETE /tenant
    Meteor.call('deleteTenant', tenantToRemove, (error, result) => {
      if (result) {
        if (result.status === 204) {
          // Always notify users when the tenant is removed
          const tenantUsers = Session.get('tenantUsers');

          // Notification to users of tenant
          Meteor.call('informTenantUser', tenantUsers, 'tenantRemoval', tenantToRemove.name, (notifyError, notifyResult) => {
            if (notifyError) {
              sAlert.error('Error in notifying users', { timeout: 'none' });
            }
          });

          // Tenant successfully removed from manager side, empty local list
          tenantList = [];
          // Save to sessionStorage to be used while adding users to tenant
          Session.set('tenantList', tenantList);

          // Operation finished, inform spinner
          Session.set('tenantRemoveOngoing', false);

          // Close confirmation modal
          Modal.hide('ensureTenantRemovalForm');

          // Get success message translation
          let message = TAPi18n.__('tenantForm_removal_Success_Message');
          // Alert user of success
          message = message.concat(tenantToRemove.name);
          sAlert.success(message);
        } else {
          // Operation finished, inform spinner
          Session.set('tenantRemoveOngoing', false);

          // Tenant addition failure on manager side, save new tenant object to local array
          const errorMessage = `Tenant manager error! Returns code (${result.status}).`;
          sAlert.error(errorMessage, { timeout: 'none' });
        }
      } else {
        // Operation finished, inform spinner
        Session.set('tenantRemoveOngoing', false);

        // Tenant addition failure on manager side, save new tenant object to local array
        const errorMessage = `Tenant removal failed!  (${error}).`;
        sAlert.error(errorMessage, { timeout: 'none' });
      }
    });
  },
});

Template.ensureTenantRemovalForm.helpers({
  tenantRemoveOngoing () {
    const tenantRemoveOngoing = Session.get('tenantRemoveOngoing');
    // Return spinner status
    return tenantRemoveOngoing;
  },
});
