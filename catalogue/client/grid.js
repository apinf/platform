Template.apiCatalogue.onCreated(function (){
  const instance = this;

  //instance.subscribe('allApiBackends');
  instance.subscribe("catalogue");
  instance.subscribe("catalogueRatings");
  instance.subscribe("catalogueBookmarks");
});

Template.apiCatalogue.helpers({
  apiBackends () {
    // Return cursor to all apiBackends
    return ApiBackends.find();
  },
  apiBackendsCount () {
    return ApiBackends.find().count();
  }
});

Template.apiCatalogue.helpers({
  apiBackends () {
    // Return cursor to all apiBackends
    return ApiBackends.find();
  },
  apiBackendsCount () {
    return ApiBackends.find().count();
  }
});
