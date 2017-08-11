/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

Template.apisFilterForm.onRendered(function () {
  this.autorun(() => {
    // Get the query parameter
    const lifecycleParameter = FlowRouter.getQueryParam('lifecycle');

    // If parameter exists
    if (lifecycleParameter) {
      // Update the select menu to match lifecycle phase
      this.$('[name=lifecycle]').val(lifecycleParameter);

      // Add active class for the filter icon to show that filter is active
      $('#filter-icon').addClass('active');
    } else {
      // Set (Select one) option
      this.$('[name=lifecycle]').val('');

      // Delete active from the filter icon to show that filter isn't active
      $('#filter-icon').removeClass('active');
    }
  });
});

Template.apisFilterForm.helpers({
  lifeCycleFilter () {
    // The available lifecycle status
    const lifecycleStatus = [
      'development',
      'deprecated',
      'design',
      'production',
      'testing',
    ];

    // Return lifecycle status with translation
    return lifecycleStatus.map((value) => {
      return {
        value,
        label: TAPi18n.__(`schemas.apis.lifecycleStatus.options.${value}`),
      };
    });
  },
});

Template.apisFilterForm.events({
  'change [name=lifecycle]': (event, templateInstance) => {
    // Get & save value of selected item
    templateInstance.lifecycle = event.currentTarget.value;
  },
  'click #filter-apis': (event, templateInstance) => {
    if (templateInstance.lifecycle) {
      const tag = templateInstance.lifecycle;

      // Save selected filter on query params
      FlowRouter.setQueryParams({ lifecycle: tag });
    } else {
      // Delete query params
      FlowRouter.setQueryParams({ lifecycle: null });
    }

    // Hide filter form
    $('.filter-popup').toggleClass('filter-popup-visible');
  },
  'click [type=reset]': () => {
    // Delete query parameter
    FlowRouter.setQueryParams({ lifecycle: null });
  },
});
