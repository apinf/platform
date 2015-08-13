Template.apiBackendsManage.created = function () {
  this.subscribe('myManagedApis');
};

Template.apiBackendsManage.rendered = function () {
  var myManagedApis = ApiBackends.find().fetch();

  //console.log(myManagedApis);
};
