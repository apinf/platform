
Template.statusCheck.onRendered(() => {
  // calls statusCheck method
  Meteor.call('statusCheck', (err, status) => {
    // initialising DIV tags
    const apinfState = $('#apinfState');
    const esState = $('#esState');
    const apiUmbrellaState = $('#apiUmbrellaState');
    const fullState = $('#fullState');

    // checks if apinf is operating
    if (status.apinf.operational) {
      // if yes, colors text to green color
      apinfState.addClass('text-success');
    } else {
      // if not, colors text to red
      apinfState.addClass('text-danger');
    }

    // adds status message to a template
    apinfState.html(status.apinf.message);

    // checks if API Umbrella is operating
    if (status.apiUmbrella.operational) {
      // if yes, colors text to green color
      apiUmbrellaState.addClass('text-success');
    } else {
      // if not, colors text to red
      apiUmbrellaState.addClass('text-danger');
    }

    // adds status message to a template
    apiUmbrellaState.html(status.apiUmbrella.message);

    // elasticsearch
    if (status.elasticsearch.operational) {
      // if yes, colors text to green color
      esState.addClass('text-success');
    } else {
      // if not, colors text to red
      esState.addClass('text-danger');
    }

    // adds status message to a template
    esState.html(status.elasticsearch.message);

    // checks if all the services are operational
    if (status.apinf.operational &&
        status.apiUmbrella.operational &&
        status.elasticsearch.operational) {
      // if all the systems are operational,
      // adds alert-success class and success message to an element
      fullState.addClass('alert-success');
      fullState.html('All systems operational.');
    } else {
      // if not, adds alert-danger class and message to an element
      fullState.addClass('alert-danger');
      fullState.html('Something is wrong.');
    }
  });
});
