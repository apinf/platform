import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function () {
  const instance = this;

  instance.subscribe("catalogue");
  instance.subscribe("catalogueRatings");
  instance.subscribe("catalogueBookmarks");  
});

Template.catalogue.helpers({
  apiBackends () {
    return ApiBackends.find().count();
  }
});
