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
