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
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import moment from 'moment';

// Collection imports
import Branding from '/apinf_packages/branding/collection';

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
    let tenantList = Session.get('tenantList');

    // fetch list of tenants from tenant manager
    Meteor.call('getTenantList', (error, result) => {
      if (result) {
        tenantList = result.tenantList;
        Session.set('tenantList', tenantList);
      }
      if (error) {
        sAlert.error(error, { timeout: 'none' });
      }
    });

    // fetch list of users from tenant manager
    Meteor.call('getTenantUserList', (error, result) => {
      if (result) {
        Session.set('completeUserList', result.completeUserList);
      }
      if (error) {
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
  tenantTokenExpiration () {
    // Get user id
    const userId = Meteor.userId();
    if (userId) {
      const user = Meteor.users.findOne(userId);

      if (user && user.services && user.services.fiware) {
        // Get current language
        const language = TAPi18n.getLanguage();
        // Return timestamp
        return moment(user.services.fiware.expiresAt).locale(language);
      }
    }
    return false;
  },
  tenantRefreshToken () {
    // Get user id
    const userId = Meteor.userId();
    if (userId) {
      const user = Meteor.users.findOne(userId);

      if (user && user.services && user.services.fiware) {
        return user.services.fiware.refreshToken;
      }
    }
    return false;
  },
  userCanAddTenant () {
    const userId = Meteor.userId();

    if (userId) {
      const user = Meteor.users.findOne(userId);

      // Logged in via Fiware, OK
      if (user && user.services && user.services.fiware) {
        return true;
      }
    }
    return false;
  },
});

Template.tenantCatalog.events({
  'mouseover #add-tenant': function () {
    // eslint-disable-next-line
    const expired = Template.authorizationForm.__helpers.get('tenantTokenExpiration').call();
    if (expired.expirationEffect) {
      // Get warning message translation
      const message = TAPi18n.__('tenantForm_tokenExpiredWarning_message');
      // Alert user of success
      sAlert.warning(message);
    }
  },
  'click #add-tenant': function () {
    // Empty possible tenant user list
    if (Session.get('tenantUsers')) {
      const tenantUsers = Session.get('tenantUsers');

      // Empty the tenant user list
      tenantUsers.splice(0, tenantUsers.length);
      // Remove users from session
      Session.set('tenantUsers', tenantUsers);
    }
    // Open modal form for adding tenant
    Modal.show('tenantForm');
  },
  'mouseover #edit-tenant': function () {
    // eslint-disable-next-line
    const expired = Template.authorizationForm.__helpers.get('tenantTokenExpiration').call();
    if (expired.expirationEffect) {
      // Get warning message translation
      const message = TAPi18n.__('tenantForm_tokenExpiredWarning_message');
      // Alert user of success
      sAlert.warning(message);
    }
  },
  'click #edit-tenant': function (event) {
    // The button sends the index of tenant to be updated
    const tenantUpdateIndex = $(event.target).data('value');

    // Read tenant list
    const tenantList = Session.get('tenantList');
    const tenantToModify = tenantList[tenantUpdateIndex];

    // Save users of tenant in question into tenant users
    Session.set('tenantUsers', tenantToModify.users);

    // Open modal form for modifying tenant
    Modal.show('tenantForm', { tenantToModify });
  },
  'mouseover #remove-tenant': function () {
    // eslint-disable-next-line
    const expired = Template.authorizationForm.__helpers.get('tenantTokenExpiration').call();
    if (expired.expirationEffect) {
      // Get warning message translation
      const message = TAPi18n.__('tenantForm_tokenExpiredWarning_message');
      // Alert user of success
      sAlert.warning(message);
    }
  },
  'click #remove-tenant': function (event) {
    // The button sends the index of tenant to be removed
    const tenantRemoveIndex = $(event.target).data('value');

    // Read tenant list
    const tenantList = Session.get('tenantList');

    // get selected tenant data
    const tenantToRemove = tenantList[tenantRemoveIndex];

    // Open modal form for ensuring tenant removal
    Modal.show('ensureTenantRemovalForm', { tenantRemoveIndex, tenantToRemove });
  },
  'click #show-authorization': function () {
    // Open modal form for adding tenant
    Modal.show('authorizationForm');
  },
});
