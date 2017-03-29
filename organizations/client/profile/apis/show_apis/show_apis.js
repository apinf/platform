/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Apis from '/apis/collection';

Template.organizationShowApis.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Create placeholder for storage
  instance.managedApis = new ReactiveVar();

  // Get Organization document from template data
  const organization = instance.data.organization;

  // Get IDs of relevant APIs
  const managedApiIds = organization.managedApiIds();

  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Apis, {
    // Count of cards in catalog
    perPage: 4,
    // Set sort by name on default
    sort: { name: 1 },
    filters: { _id: { $in: managedApiIds } },
  });

  // Watching for changes of lifecycle parameter
  instance.autorun(() => {
    // Filter by managed APIs on default
    const filters = { _id: { $in: managedApiIds } };

    // Get query parameter LifeCycle
    const lifecycleParameter = FlowRouter.getQueryParam('lifecycle');

    // Make sure filter is set
    if (lifecycleParameter) {
      // Filter data by lifecycle status
      filters.lifecycleStatus = lifecycleParameter;
    }

    instance.pagination.filters(filters);
  });

  // Watching for changes of sortBy parameter
  instance.autorun(() => {
    // Sort by name on default
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

Template.organizationShowApis.helpers({
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
  totalItems () {
    const instance = Template.instance();
    // Get the total number of documents
    return instance.pagination.totalItems();
  },
  templatePagination () {
    const instance = Template.instance();
    // Get reference of pagination
    return instance.pagination;
  },
});

Template.organizationShowApis.events({
  'click [data-lifecycle]': (event) => {
    // Get value of data-lifecycle
    const selectedTag = event.currentTarget.dataset.lifecycle;
    // Set value in query parameter
    FlowRouter.setQueryParams({ lifecycle: selectedTag });
  },
});
