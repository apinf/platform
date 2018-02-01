/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

Template.organizationApis.onCreated(function () {
  // Get reference to template instance
  const instance = this;
  // Get Organization document from template data
  const organization = instance.data.organization;

  if (organization) {
    // Get pagination count for organization APIs
    const perPage = parseInt(instance.data.organization.apisPerPage, 10);

    // Set initial settings of pagination
    instance.pagination = new Meteor.Pagination(Apis, {
      // Count of cards in catalog
      perPage,
      // Set sort by name on default
      sort: { name: 1 },
      filters: organization.userVisibleApiFilter(),
    });
  }

  // Watching on changes of managed APIs after connection to/disconnection from
  instance.autorun(() => {
    if (Template.currentData().organization) {
      // reactive solution to update pagination with template instant data
      const updatedApisPerPage = Template.currentData().organization.apisPerPage || 10;

      // Get ids of managed APIs of organization
      const apiIds = organization.managedApiIds();

      // Get settings of current filter
      const currentFilters = instance.pagination.filters();

      // Filter by managed APIs
      currentFilters._id = { $in: apiIds };

      // Set updated filter
      instance.pagination.filters(currentFilters);

      // Set update perpage
      instance.pagination.perPage(updatedApisPerPage);
    }
  });

  // Watching for changes of lifecycle parameter
  instance.autorun(() => {
    // Get settings of current filter
    const filters = instance.pagination.filters();

    // Get query parameter LifeCycle
    const lifecycleParameter = FlowRouter.getQueryParam('lifecycle');

    // Make sure filter is set
    if (lifecycleParameter) {
      // Filter data by lifecycle status
      filters.lifecycleStatus = lifecycleParameter;
    } else {
      // Otherwise remove this parameter from current filter
      delete filters.lifecycleStatus;
    }

    instance.pagination.filters(filters);
  });

  // Watching for changes of sortBy parameter
  instance.autorun(() => {
    // Placeholder for sort settings
    const sort = {};

    // Get query parameter sortBy
    const sortByParameter = FlowRouter.getQueryParam('sortBy');

    // Make sure sorting is set
    if (sortByParameter) {
      // Sort by name is ascending other cases are descending sort
      const sortDirection = sortByParameter === 'name' ? 1 : -1;
      // Set sorting
      sort[sortByParameter] = sortDirection;
    } else {
      // Sort by name is default
      sort.name = 1;
    }

    // Change sorting
    instance.pagination.sort(sort);
  });
});

Template.organizationApis.helpers({
  apis () {
    const instance = Template.instance();

    // Get apis collection via Pagination
    const apis = instance.pagination.getPage();
    // Get the sort via Pagination
    const sort = instance.pagination.sort();

    // Make sure sorted by name
    if (sort.name) {
      // Get the language
      const language = TAPi18n.getLanguage();

      // Use custom sort function with i18n support
      apis.sort((a, b) => {
        return a.name.localeCompare(b.name, language) * sort.name;
      });
    }

    return apis;
  },
  apisCount () {
    const instance = Template.instance();
    // Get the total number of documents
    return instance.pagination.totalItems();
  },
  templatePagination () {
    const instance = Template.instance();
    // Get reference of pagination
    return instance.pagination;
  },
  paginationReady () {
    // Check if pagination subscription is ready
    return Template.instance().pagination.ready();
  },
  hasApi () {
    const instance = Template.instance();
    // Get documents
    const apis = instance.pagination.getPage();
    // Get the current settings for filter
    const switchedFilter = instance.pagination.filters();

    // Organization has API at all OR a result of filtering is empty
    return (apis.length || (apis.length === 0 && switchedFilter.lifecycleStatus));
  },
});

Template.organizationApis.events({
  'click #connect-api': () => {
    // Get Organization from template instance
    const organization = Template.currentData().organization;

    // Check organization exist
    if (organization) {
      // Show modal with list of suggested apis and id of current organization
      Modal.show('connectApiToOrganizationModal', { organization });
    } else {
      // Otherwise show error
      const message = TAPi18n.__('organizationProfile_text_error');
      sAlert.error(message, { timeout: 'none' });
    }
  },
  'click [data-lifecycle]': (event) => {
    // Get value of data-lifecycle
    const selectedTag = event.currentTarget.dataset.lifecycle;
    // Set value in query parameter
    FlowRouter.setQueryParams({ lifecycle: selectedTag });
  },
});
