/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.apiSortingToolbar.onRendered(function () {
  this.autorun(() => {
    // Get sortBy parameter
    const sortByParameter = FlowRouter.getQueryParam('sortBy');

    // If parameter exists
    if (sortByParameter) {
      // Update the select menu to match sort parameter
      this.$('#sort-select').val(sortByParameter);
    }
  });
});

Template.apiSortingToolbar.events({
  'change #sort-select': (event) => {
    // Set URL parameter
    FlowRouter.setQueryParams({ sortBy: event.target.value });
  },
});
