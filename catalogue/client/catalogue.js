import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function () {
  const instance = this;

  instance.subscribe("catalogue");
  instance.subscribe("catalogueRatings");
  instance.subscribe("catalogueBookmarks");
});

Template.catalogue.onRendered(function () {
  $(".sort-button").tooltip({ placement: 'bottom'});
});

Template.catalogue.helpers({
  apiBackendsCount () {
    return ApiBackends.find().count();
  }
});
