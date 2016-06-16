import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function () {
  const instance = this;

  // Set up toolbar reactive variables
  instance.sortBy = new ReactiveVar("name");
  instance.sortDirection = new ReactiveVar("ascending");
  instance.filterBy = new ReactiveVar("show-all");
  instance.viewMode = new ReactiveVar("card");

  instance.autorun(function () {
    const sortBy = instance.sortBy.get();
    const sortDirection = instance.sortDirection.get();
    const filterBy = instance.filterBy.get();
    const viewMode = instance.viewMode.get();

    const subscriptionOptions = {
      sortBy,
      sortDirection,
      filterBy
    };

    // Subscribe to API Backends with catalogue settings
    //instance.subscribe("catalogue", subscriptionOptions);

    console.log(sortBy, sortDirection, filterBy, viewMode);
  });
});

Template.catalogue.onRendered(function () {
  // Activate tooltips on all relevant items
  $(".toolbar-tooltip").tooltip({ placement: 'bottom'});
});

Template.catalogue.helpers({
  apiBackendsCount () {
    return ApiBackends.find().count();
  }
});

Template.catalogue.events({
  'change #sort-select' (event, instance) {
    // Get selected sort value
    const sortBy = event.target.value;

    // Update the instance sort value reactive variable
    instance.sortBy.set(sortBy);
  }
});
