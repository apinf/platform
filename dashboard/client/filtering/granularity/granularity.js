import { Template } from 'meteor/templating';

Template.granularity.onRendered(function () {
  // Get reference to template instance
  const instance = this;

// Check URL parameters for granularity
  const granularityParameter = UniUtils.url.getQuery('granularity');

  if (granularityParameter) {
    // Set the granularity UI state from URL parameter
    instance.$('[name="granularity"]').val([granularityParameter]);
  } else {
    // Get granularity from template
    const granularity = instance.$('[name=granularity]:checked').val();

    // Set granularity URL parameter from template value
    UniUtils.url.setQuery('granularity', granularity);
  }
});

Template.granularity.events({
  'change #date-granularity-selector': function (event) {
    // Get granularity value
    const granularity = event.target.value;

    // Set granularity URL parameter
    UniUtils.url.setQuery('granularity', granularity);
  },
});
