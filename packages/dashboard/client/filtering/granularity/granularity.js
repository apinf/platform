/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.granularity.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  instance.autorun(() => {
    // Get granularity parameters
    const granularityParameter = FlowRouter.getQueryParam('granularity');

    // Set the granularity UI state from URL parameter
    instance.$(`#${granularityParameter}-granularity`).button('toggle');
  });
});

Template.granularity.events({
  'change #date-granularity-selector': function (event) {
    // Modifies the current history entry instead of creating a new one
    FlowRouter.withReplaceState(() => {
      // Set granularity value to URL parameter
      FlowRouter.setQueryParams({ granularity: event.target.value });
    });
  },
});
