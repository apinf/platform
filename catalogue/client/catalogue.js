import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function () {
  const instance = this;

  // Set up toolbar reactive variables
  instance.sortBy = new ReactiveVar("name");
  instance.sortDirection = new ReactiveVar("ascending");
  instance.filterBy = new ReactiveVar("show-all");
  instance.viewMode = new ReactiveVar("grid");

  instance.autorun(function () {
    const sortBy = instance.sortBy.get();
    const sortDirection = instance.sortDirection.get();
    const filterBy = instance.filterBy.get();

    const subscriptionOptions = {
      sortBy,
      sortDirection,
      filterBy
    };

    // Subscribe to API Backends with catalogue settings
    instance.subscribe("catalogue", subscriptionOptions);
  });

  // Subscribe to API logo colection
  instance.subscribe("allApiLogo");

  // Subscribe to Meteor.users to show authors. Show only visible authors.
  instance.subscribe("allUsers");
});

Template.catalogue.onRendered(function () {
  // Activate tooltips on all relevant items
  $(".toolbar-tooltip").tooltip({ placement: 'bottom'});
});

Template.catalogue.helpers({
  apiBackendsCount () {
    return ApiBackends.find().count();
  },
  apiBackends () {
    const instance = Template.instance();

    let sortBy = instance.sortBy.get();
    let sortDirection = instance.sortDirection.get();

    if (sortDirection === "ascending") {
      sortDirection = 1;
    } else {
      sortDirection = -1;
    }


    const sortOptions = { sort: { } };
    sortOptions.sort[sortBy] = sortDirection;

    return ApiBackends.find({}, sortOptions).fetch();
  },
  gridViewMode () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === "grid");
  },
  tableViewMode () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === "table");
  }
});

Template.catalogue.events({
  'change #sort-select' (event, instance) {
    // Get selected sort value
    const sortBy = event.target.value;

    // Update the instance sort value reactive variable
    instance.sortBy.set(sortBy);
  },
  'change [name=sort-direction]' (event, instance) {
    // Get selected sort value
    const sortDirection = event.target.value;

    // Update the instance sort value reactive variable
    instance.sortDirection.set(sortDirection);
  },
  'change [name=filter-options]' (event, instance) {
    // Get selected sort value
    const filterBy = event.target.value;

    // Update the instance sort value reactive variable
    instance.filterBy.set(filterBy);
  },
  'change [name=view-mode]' (event, instance) {
    // Get selected sort value
    const viewMode = event.target.value;

    // Update the instance sort value reactive variable
    instance.viewMode.set(viewMode);
  }
});
