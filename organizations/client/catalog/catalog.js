import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';

import Organizations from '/organizations/collection';

import $ from 'jquery';

Template.organizationCatalog.onCreated(function () {
  const instance = this;

  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Organizations, {
    // Count of cards in catalog
    perPage: 24,
    // Set sort by name on default
    sort: { name: 1 },
  });

  // Subscribe to Organization logo collection
  instance.subscribe('allOrganizationLogo');

  // Watch for changes in the sort settings
  instance.autorun(() => {
    // Check URL parameter for sorting
    const sortByParameter = FlowRouter.getQueryParam('sortBy');

    // Check URL parameter for sort direction
    const sortDirectionParameter =
      FlowRouter.getQueryParam('sortDirection') === 'ascending' ? 1 : -1;

    // Create a object for storage sorting parameters
    const sort = {};
    // Get field and direction of sorting
    sort[sortByParameter] = sortDirectionParameter;

    // Change sorting
    instance.pagination.sort(sort);
  });
});

// eslint-disable-next-line prefer-arrow-callback
Template.organizationCatalog.onRendered(function () {
  // Activate tooltips on all relevant items
  $('.toolbar-tooltip').tooltip({ placement: 'bottom' });
});

Template.organizationCatalog.helpers({
  organizations () {
    // Return items of organization collection via Pagination
    return Template.instance().pagination.getPage();
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
});

Template.organizationCatalog.events({
  'click #add-organization': function () {
    // Show organization form modal
    Modal.show('organizationForm', { formType: 'insert' });
  },
});
