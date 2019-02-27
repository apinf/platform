/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Roles } from 'meteor/alanning:roles';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import Settings from '/apinf_packages/settings/collection';

// Npm packages imports
import _ from 'lodash';

Template.tenantCatalog.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.autorun(() => {
    // Get Branding collection content
    const branding = Branding.findOne();
    // Check if Branding collection and siteTitle are available
    if (branding && branding.siteTitle) {
      // Set the page title
      const pageTitle = TAPi18n.__('tenantCatalogPage_title_organizationsCatalog');
      DocHead.setTitle(`${branding.siteTitle} - ${pageTitle}`);
    }
  });
});

// eslint-disable-next-line prefer-arrow-callback
Template.tenantCatalog.onRendered(function () {
  // Activate tooltips on all relevant items
  $('.toolbar-tooltip').tooltip({ placement: 'bottom' });

  // Get reference to template instance
  const instance = this;  

  // Here are tenants fetched from tenant manager
  instance.autorun(() => {
    // get possible local tenant list

    // Problem, falls into perpetuum loop here!!!

    let tenantList = Session.get('tenantList');

    // fetch list of tenants from tenant manager
    Meteor.call('getTenantList', (error, result) => {
      if (result) {
  //      if (tenantList && tenantList.length > 0) {
  //        tenantList = tenantList.concat(result.tenantList);
  //      } else {
          tenantList = result.tenantList;
  //      }
        Session.set('tenantList', tenantList);
      }
    });

    // fetch list of users from tenant manager
    Meteor.call('getTenantUserList', (error, result) => {
      if (result) {
        console.log('userlist haku, result=', result);
        Session.set('completeUserList', result.completeUserList);
      } else {
        console.log(' userlist haku, error=', error);
        sAlert.error(error, { timeout: 'none' });
      }
    });
  });

});

Template.tenantCatalog.helpers({
  tenantList () {
    const tenantList = Session.get('tenantList');
    return tenantList;
  },
  tenantsCount () {
    const existingTenants = Session.get('tenantList');
    
    if (existingTenants && existingTenants.length > 0) {
      return existingTenants.length;
    }
    // No tenants
    return 0;
  },
  tenantToken () {
    // Get user id
    const userId = Meteor.userId();
    const user = Meteor.users.findOne(userId);

    if (user && user.services && user.services.fiware) {
      return user.services.fiware.accessToken;
    }
    return false;
  },
  tenantRefreshToken () {
    // Get user id
    const userId = Meteor.userId();
    const user = Meteor.users.findOne(userId);

    if (user && user.services && user.services.fiware) {
      return user.services.fiware.refreshToken;
    }
    return false;
  },
  gridViewMode () {
    // Get view mode from template
    const viewMode = FlowRouter.getQueryParam('viewMode');

    return (viewMode === 'grid');
  },
  tableViewMode () {
    // Get view mode from template
    const viewMode = FlowRouter.getQueryParam('viewMode');

    return (viewMode === 'table');
  },
  userCanAddTenant () {
    const userId = Meteor.userId();

    if (userId) {
      // Get settigns document
      const settings = Settings.findOne();

      if (settings) {
        // Get value of field or false as default value
        const onlyAdmins = _.get(settings, 'access.onlyAdminsCanAddOrganizations', false);

        if (!onlyAdmins) {
          // Allow user to add an Organization because not only for admin
          return true;
        }

        // Otherwise check if current user is admin
        return Roles.userIsInRole(userId, ['admin']);
      }

      // Return true because no settings are set
      // By default allowing all user to add an Organization
      return true;
    }

    // If user isn't loggin then don't allow
    return false;
  },
});

Template.tenantCatalog.events({
  'click #add-tenant': function () {
    // Empty possible tenant user list 
    if (Session.get('tenantUsers')) {
      const tenantUsers = Session.get('tenantUsers');
      console.log('tenantUsers=', tenantUsers);

      // Empty the tenant user list
      tenantUsers.splice(0, tenantUsers.length);
      // Remove users from session
      Session.set('tenantUsers', tenantUsers);
    }    
    // Open modal form for adding tenant
    Modal.show('tenantForm');
  },
  'click #edit-tenant': function (event) {
    console.log('event=', event);

    // The button sends the index of tenant to be updated
    const tenantUpdateIndex = $(event.target).data('value');

    console.log('edit index= ', tenantUpdateIndex);
    // Read tenant list
    const tenantList = Session.get('tenantList');
    const tenantToModify = tenantList[tenantUpdateIndex];

    console.log('editoitava tenantti=', tenantToModify);

    // Get tenant user list from tenant object
    console.log('tenant usrs=', tenantToModify.users);

    // Save users of tenant in question into tenant users
    Session.set('tenantUsers', tenantToModify.users);

    // Open modal form for modifying tenant
    Modal.show('tenantForm', { tenantToModify });
  },
  'click #remove-tenant': function (event) {
    // The button sends the index of tenant to be removed
    const tenantRemoveIndex = $(event.target).data('value');

    // Read tenant list
    let tenantList = Session.get('tenantList');

    // get selected tenant data
    const tenantToRemove = tenantList[tenantRemoveIndex];
    console.log('poistettava tenantti=', tenantToRemove);

    // TODO when Fiware implements the DELETE method, this might need revision
    
    // DELETE /tenant
    Meteor.call('deleteTenant', tenantToRemove, (error, result) => {
      if (result) {
        console.log(+new Date(), ' 2 a result=', result);
        if (result.status === 204) {

          // New tenant successfully added on manager side, empty local list
          tenantList = [];
          // Save to sessionStorage to be used while adding users to tenant
          Session.set('tenantList', tenantList);
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
