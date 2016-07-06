import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ApiBackends } from '/apis/collection/backend';

Template.dashboardChartsFiltering.onCreated(function () {

  // Get reference to template instance
  const instance = this;

  // Create reactive variable to keep API array
  instance.apis = new ReactiveVar();

  // Subscribe to publication
  instance.subscribe('myManagedApis');

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      // Update variable with data
      instance.apis.set(ApiBackends.find().fetch());
    }
  });
});

Template.dashboardChartsFiltering.helpers({
  apis () {

    // Get reference to template instance
    const instance = Template.instance();

    return instance.apis.get();
  },
  selectedApi (apiId) {

    // Get session variable
    const apiBackendId = Session.get('apiBackendId');

    // Check if session is set & set selected state depending on it
    return (apiId === apiBackendId) ? 'selected' : '';
  }
});

Template.dashboardChartsFiltering.events({
  'change #filtering-form': function (event) {

    // Prevent default form submit
    event.preventDefault();

    // Get reference to template instance
    const instance = Template.instance();

    // Get selected value
    const apiFrontendPrefix = $('#api-frontend-prefix').val();

    // Set session variable
    Session.set('apiFrontendPrefix', apiFrontendPrefix);
  }
})
