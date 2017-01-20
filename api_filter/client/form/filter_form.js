
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.apisFilterForm.helpers({
  lifeCycleFilter () {
    return [
      'development',
      'deprecated',
      'design',
      'production',
      'testing',
    ]
  },
})
Template.apisFilterForm.events({
  'change [name=lifecycle]': (event, templateInstance) => {
    // Get & save value of selected item
    templateInstance.lifecycle = event.currentTarget.value;
    if (event.currentTarget.value) {

    }
  },
  'click #filter-apis': (event, templateInstance) => {
    if (templateInstance.lifecycle) {
      const tag = templateInstance.lifecycle;
      // Save selected filter on query params
      FlowRouter.setQueryParams({ lifecycle: tag });
    }

    $('.filter-popup').toggleClass('filter-popup-visible');

  },
  'click [type=reset]': (event, templateInstance) => {
    // Delete tag from
    // templateInstance.lifecycle = undefined;

    FlowRouter.setQueryParams({ lifecycle: null });
  },

});
