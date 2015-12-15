Template.search.created = function () {

  var instance = this;

  instance.searchValue = new ReactiveVar();

  instance.searchParameter = new ReactiveVar(Router.current().params.query.q);

};
