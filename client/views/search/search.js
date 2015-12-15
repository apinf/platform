Template.search.created = function () {

  var instance = this;

  instance.searchValue = new ReactiveVar();

  instance.searchParameter = new ReactiveVar(Router.current().params.query.q);

};

Template.search.helpers({
  searchResults: function() {

    var instance = Template.instance();

    if (instance.searchParameter.get()) {

      var searchValue = instance.searchParameter.get();

    } else {

      var searchValue = instance.searchValue.get();

    }

    Meteor.subscribe("search", searchValue);

    var searchResults = ApiBackends.find().fetch();

    console.log(searchResults);

    return searchResults;

  }
});
