/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Roles } from 'meteor/alanning:roles';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import Organizations from '/apinf_packages/organizations/collection';
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

    console.log('tenant-listan alustukseen');
    // TODO tenant
    // fetch list of tenants from tenant manager
    // GET /tenants
    console.log('haetaan tenantteja');
    const tenants = Meteor.call('getTenantList');
    console.log('hakuvastaus=', tenants);

    console.log('oma alustus');
    if (Session.get('tenantList')) {
      console.log('tenant list existed already');
    } else {
      // Here the complete tenant list will be fetched from Tenant manager
      // For mock purposes just filling the list
      const tenantList = [
        {
          id: 1123456789,
          owner_id: 1987654321,
          tenant_organization: "1111",
          name: 'First tenant',
          description: 'This is a first class tenant',
          users: [
            ['123qwe', 'Spede', '-', 'Consumer'],
            ['223qwe', 'Simo', 'Provider', '-'],
            ['323qwe', 'Vesku', 'Provider', 'Consumer'],
          ],
        },
        {
          id: 2123456789,
          owner_id: 2987654321,
          tenant_organization: "1111",
          name: 'Second tenant',
          description: 'This is a second class tenant',
          users: [
            ['423qwe', 'Tupu', 'Provider', '-'],
            ['523qwe', 'Hupu', 'Provider', 'Consumer'],
            ['623qwe', 'Lupu', '-', 'Consumer'],
            ['723qwe', 'Skrupu', '-', 'Consumer'],
          ],
        },
        {
          id: 3123456789,
          owner_id: 31987654321,
          tenant_organization: "1111",
          description: 'This is a third class tenant',
          name: 'Third tenant',
          users: [
            ['a123qwe', 'Ismo', 'Provider', '-'],
            ['b123qwe', 'Asmo', 'Provider', 'Consumer'],
            ['c123qwe', 'Osmo', '-', 'Consumer'],
            ['d123qwe', 'Atso', 'Provider', 'Consumer'],
            ['e123qwe', 'Matso', '-', 'Consumer'],
          ],
        },
      ];
      console.log('tenant-list alustettu=', tenantList);

      // Save to localStorage to be used while adding users to tenant
      Session.set('tenantList', JSON.stringify(tenantList));
    }

    // Here the complete user list will be fetched from Tenant manager

    // For mock purposes we fill the list here ourself
    const completeUserList = [
      ['Håkan', '123456789'],
      ['Luis', '223456789'],
      ['Pär', '323456789'],
      ['Ivan', '423456789'],
      ['Hans', '523456789'],
      ['Pierre', '62345689'],
      ['Väinämöinen', '723456789'],
      ['Jack', '82356789'],
      ['Umberto', '92356789'],
    ];

    // Save to sessionStorage to be used while adding users to tenant
    Session.set('completeUserList', JSON.stringify(completeUserList));
  });


  // Get user id
  const userId = Meteor.userId();

  // Default sort
  const defaultSort = { name: 1 };

  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Organizations, {
    // Count of cards in catalog
    perPage: 24,
    // Set sort by name on default
    sort: defaultSort,
  });

  // Watch for changes in the sort settings
  instance.autorun(() => {
    // Check URL parameter for sorting
    const sortByParameter = FlowRouter.getQueryParam('sortBy');

    // Check URL parameter for sort direction
    const sortDirectionParameter =
      FlowRouter.getQueryParam('sortDirection') === 'ascending' ? 1 : -1;

    // Create a object for storage sorting parameters
    let sort = {};

    // Check of existing parameters
    if (sortByParameter && sortDirectionParameter) {
      // Get field and direction of sorting
      sort[sortByParameter] = sortDirectionParameter;
    } else {
      // Otherwise get it like default value
      sort = defaultSort;
    }
    // Change sorting
    instance.pagination.sort(sort);
  });

  // Watch for changes in the filter settings
  instance.autorun(() => {
    // Check URL parameter for filtering
    const filterByParameter = FlowRouter.getQueryParam('filterBy');

    // Set filter as empty
    let currentFilters = {};

    // Filtering available for registered users
    if (userId) {
      switch (filterByParameter) {
        case 'all': {
          // Delete filter for managed organizations
          delete currentFilters.managerIds;
          break;
        }
        case 'my-organizations': {
          // Set filter for managed apis
          currentFilters.managerIds = userId;
          break;
        }
        default: {
          // Otherwise get it like default value
          currentFilters = {};
          break;
        }
      }
    }

    // Filter data
    instance.pagination.filters(currentFilters);
  });
});

// eslint-disable-next-line prefer-arrow-callback
Template.tenantCatalog.onRendered(function () {
  // Activate tooltips on all relevant items
  $('.toolbar-tooltip').tooltip({ placement: 'bottom' });
});

Template.tenantCatalog.helpers({
  tenantList () {
    const tenantList = JSON.parse(Session.get('tenantList'));
    return tenantList;
  },
  tenants () {
    const existingTenants = JSON.parse(Session.get('tenantList'));

    if (existingTenants.length > 0) {
      console.log('löytyi');
      return true;
    }
    console.log('ei löytynyt');
    // No tenants
    return false;
  },
  paginationReady () {
    // Check if pagination subscription is ready
    return Template.instance().pagination.ready();
  },
  templatePagination () {
    // Get reference of pagination
    return Template.instance().pagination;
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
  tenantCount () {
    // Return organizations count
    return Template.instance().pagination.totalItems();
  },
});

Template.tenantCatalog.events({
  'click #add-tenant': function () {
    // Show tenant form modal
    Modal.show('tenantForm', { formType: 'insert' });
  },
  'click #remove-tenant': function (event) {
    // The button sends the index of tenant to be removed
    const tenantRemoveIndex = $(event.target).data('value');

    // Read tenant list
    const tenantList = JSON.parse(Session.get('tenantList'));

    // TODO tenant
    // get selected tenant data
    console.log('poistettava tenantti=', tenantList[tenantRemoveIndex]);

    // call tenant manager 
    // DELETE /tenants/<tenant-nimi>

    // Most probably the tenant needs to be removed from Session data in order 
    // to make list gotten from tenant manager again
    // Remove tenant object from array
    tenantList.splice(tenantRemoveIndex, 1);

    // Save to localStorage to be used while adding users to tenant
    Session.set('tenantList', JSON.stringify(tenantList));
  },

});
