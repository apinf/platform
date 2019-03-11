/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Npm packages imports
import _ from 'lodash';

Template.ensureTenantRemovalForm.events({
  'click #remove-tenant-confirmed': function (event) {
    // The button sends the index of tenant to be removed
    const tenantRemoveIndex = $(event.target).data('value');

    // Read tenant list
    let tenantList = Session.get('tenantList');

    // get selected tenant data
    const tenantToRemove = tenantList[tenantRemoveIndex];
    console.log('poistettava tenantti=', tenantToRemove);

    // DELETE /tenant
    Meteor.call('deleteTenant', tenantToRemove, (error, result) => {
      if (result) {
        console.log(+new Date(), ' 2 a result=', result);
        if (result.status === 204) {
          // New tenant successfully added on manager side, empty local list
          tenantList = [];
          // Save to sessionStorage to be used while adding users to tenant
          Session.set('tenantList', tenantList);

          // Close confirmation modal
          Modal.hide('ensureTenantRemovalForm');
        } else {
          // Tenant addition failure on manager side, save new tenant object to local array
          const errorMessage = `Tenant manager error! Returns code (${result.status}).`;
          sAlert.error(errorMessage, { timeout: 'none' });
        }
      } else {
        console.log(+new Date(), ' 2 b error=', error);
        // Tenant addition failure on manager side, save new tenant object to local array
        const errorMessage = `Tenant removal failed!  (${error}).`;
        sAlert.error(errorMessage, { timeout: 'none' });
      }
    });
  },
});
