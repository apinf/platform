import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function () {
  const instance = this;

  // Set up toolbar reactive variables
  instance.filterBy = new ReactiveVar("show-all");
  instance.viewMode = new ReactiveVar("grid");

  instance.autorun(function () {
    const filterBy = instance.filterBy.get();

    const subscriptionOptions = {
      filterBy
    };

    // Subscribe to API Backends with catalogue settings
    instance.subscribe("catalogue", subscriptionOptions);

    // Subscribe to ratings collection
    instance.subscribe("catalogueRatings");

    // Subscribe to bookmarks collection
    instance.subscribe("catalogueBookmarks");

    // Subscribe to API logo colection
    instance.subscribe("allApiLogo");

    // Subscribe to Meteor.users to show authors. Show only visible authors.
    instance.subscribe("allUsers");
  });
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
    return ApiBackends.find().fetch();
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
