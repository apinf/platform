Template.search.created = function () {

  // Get reference to Template
  var instance = this;

  // Init reactive var for search value
  instance.searchValue = new ReactiveVar();

  // Init reactive parameter for search parameter
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
