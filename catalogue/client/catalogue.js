import { Template } from 'meteor/templating';

Template.catalogue.onCreated(function (){
  const instance = this;

  instance.subscribe('allApiBackends');
  //instance.subscribe("catalogue");
  //instance.subscribe("catalogueRatings");
  //instance.subscribe("catalogueBookmarks");
});

Template.catalogue.helpers({
  apiBackends () {
    // Return cursor to all apiBackends
    return ApiBackends.find();
  },
  apiBackendsCount () {
    return ApiBackends.find().count();
  }
});
