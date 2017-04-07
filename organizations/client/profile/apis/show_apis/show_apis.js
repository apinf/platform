/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

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

  // Watching for changes of query parameters
  instance.autorun(() => {
    // Filter by managed APIs on default
    const filter = { _id: { $in: managedApiIds } };
    // Sort by name on default
    const sort = {};

    // Get query parameter LifeCycle
    const lifecycleParameter = FlowRouter.getQueryParam('lifecycle');

    // Make sure filter is set
    if (lifecycleParameter) {
      // Filter data by lifecycle status
      filter.lifecycleStatus = lifecycleParameter;
    }

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

    // Get the managed APIs ordered by sort parameter
    const managedApis = Apis.find(filter, { sort }).fetch();

    // Save list of managed APIs in instance reactive variable
    instance.managedApis.set(managedApis);
  });
});

Template.organizationShowApis.helpers({
  apis () {
    const instance = Template.instance();

    // Return list of managed/filtered Apis
    return instance.managedApis.get();
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
