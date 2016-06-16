import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function () {
  const instance = this;

  // instance.subscribe("catalogue");
  // instance.subscribe("catalogueRatings");
  // instance.subscribe("catalogueBookmarks");

  // Set up toolbar reactive variables
  instance.sortBy = new ReactiveVar();
  instance.sortDirection = new ReactiveVar();
  instance.filterBy = new ReactiveVar();
  instance.viewMode = new ReactiveVar();

  instance.autorun(function () {
    const sortBy = instance.sortBy.get();
    const sortDirection = instance.sortDirection.get();
    const filterBy = instance.filterBy.get();
    const viewMode = instance.viewMode.get();

    console.log(sortBy, sortDirection, filterBy, viewMode);
  });
});

Template.catalogue.onRendered(function () {
  // Activate tooltips on all relevant items
  // TODO: figure out why this causes labels to not render
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
