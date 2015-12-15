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
    
    return searchResults;

  }
});

Template.search.events({
  "keyup #search-text": function (event, template) {

    var instance = Template.instance();

    event.preventDefault();

    instance.searchParameter.set(undefined);

    var searchValue = $('#search-text').val();

    instance.searchValue.set(searchValue);
  }
});
