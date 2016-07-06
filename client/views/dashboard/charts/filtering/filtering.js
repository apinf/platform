import { ApiBackends } from '/apis/collection/backend';

Template.filtering.onCreated(function () {

  const instance = this; // Get reference to template instance

  instance.apis = new ReactiveVar(); // Create reactive variable to keep API array

  instance.subscribe('myManagedApis'); // Subscribe to publication

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      instance.apis.set(ApiBackends.find().fetch()); // Update variable with data
    }
  });
});

Template.filtering.helpers({
  apis () {

    const instance = Template.instance(); // Get reference to template instance

    return instance.apis.get();
  },
  selectedApi (apiId) {

    const apiBackendId = Session.get('apiBackendId'); // Get session variable

    // Check if session is set & set selected state depending on it
    return (apiId === apiBackendId) ? 'selected' : '';
  }
});

Template.filtering.events({
  'change #filtering-form': function (event) {

    event.preventDefault(); // Prevent default form submit

    const instance = Template.instance(); // Get reference to template instance

    const apiFrontendPrefix = $('#api-frontend-prefix').val(); // Get selected value

    Session.set('apiFrontendPrefix', apiFrontendPrefix); // Set session variable
  }
})
