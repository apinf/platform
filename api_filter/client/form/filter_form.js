import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import $ from 'jquery';

Template.apisFilterForm.helpers({
  lifeCycleFilter () {
    return [
      'development',
      'deprecated',
      'design',
      'production',
      'testing',
    ];
  },
});

Template.apisFilterForm.events({
  'change [name=lifecycle]': (event, templateInstance) => {
    // Get & save value of selected item
    /* eslint-disable no-param-reassign*/
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
});
