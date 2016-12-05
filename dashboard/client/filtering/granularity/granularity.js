import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.granularity.onRendered(function () {
  // Get reference to template instance
  const instance = this;

// Check URL parameters for granularity
  const granularityParameter = FlowRouter.getQueryParam('granularity');

  if (granularityParameter) {
    // Set the granularity UI state from URL parameter
    instance.$(`#${granularityParameter}-granularity`).button('toggle');
  } else {
    // Get granularity from template
    const granularity = instance.$('[name=granularity]:checked').val();

    // Set granularity URL parameter from template value
    FlowRouter.setQueryParams({ granularity });
  }
});

Template.granularity.events({
  'change #date-granularity-selector': function (event) {
    // Set granularity value to URL parameter
    FlowRouter.setQueryParams({ granularity: event.target.value });
  },
});
