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

    if (!Session.get('tenantList')) {
      // Here the complete tenant list will be fetched from Tenant manager

      // For mock purposes just filling the list
      const tenantList = [
        {
          name: 'First tenant',
          users: [
            ['Spede', false, 'consumer'],
            ['Simo', 'provider', false],
            ['Vesku', 'provider', 'consumer'],
          ],
        },
        {
          name: 'Second tenant',
          users: [
            ['Tupu', 'provider', false],
            ['Hupu', 'provider', 'consumer'],
            ['Lupu', false, 'consumer'],
            ['Skrupu', false, 'consumer'],
          ],
        },
        {
          name: 'Third tenant',
          users: [
            ['Ismo', 'provider', false],
            ['Asmo', 'provider', 'consumer'],
            ['Osmo', false, 'consumer'],
            ['Atso', 'provider', 'consumer'],
            ['Matso', false, 'consumer'],
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
      'Håkan',
      'Luis',
      'Pär',
      'Ivan',
      'Hans',
      'Pierre',
      'Väinämöinen',
      'Jack',
      'Umberto'
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
  organizations () {
    // Return items of organization collection via Pagination
    return Template.instance().pagination.getPage();
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
  'click #remove-tenant': function (event, templateInstance) {
    // Show tenant form modal
    console.log('tenantille kyytiä, event=', event);
    console.log('templateInstance=', templateInstance);
    console.log('this=', this);

    const selectValue = $(event.target).data('value');
    console.log('valittu=', selectValue);

    // Read tenant list
    const tenantList = JSON.parse(Session.get('tenantList'));
    console.log('tenantti ennen=', tenantList);

    // Remove user object from array
    tenantList.splice(selectValue, 1);
    console.log('tenantti jälkeen=', tenantList);

    // Save to localStorage to be used while adding users to tenant
    Session.set('tenantList', JSON.stringify(tenantList));  
  },

});
