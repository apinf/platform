Template.search.created = function () {

  // Get reference to Template instance
  var instance = this;

  // Init reactive var for search value
  instance.searchValue = new ReactiveVar();

  // Init reactive var for search results count
  instance.searchResultsCount = new ReactiveVar(0);

  instance.autorun(function () {

    // Check if search parameter is set
    if (Router.current().params.query.q) {

      var searchValue = Router.current().params.query.q;

      // Update search field with current search value
      $('#search-text').val(searchValue);

      // Assign current search value to the reactive variable
      instance.searchValue.set(searchValue);

    }

  });

};

Template.search.rendered = function () {

  // Get reference to Template
  var instance = this;

  // Check if search parameter is set
  if (instance.searchValue.get()) {

    // Update search field with search value provided in the URL
    $('#search-text').val(instance.searchValue.get());

  }

  // Put focus of search field on a page
  $('#search-text').focus();

};

Template.search.helpers({
  searchResults: function() {

    // Get reference to Template instance
    var instance = Template.instance();

    // Get query parameter & assign it to searchValue
    var searchValue = instance.searchValue.get();

    // Subscribe to a "search" publication
    Meteor.subscribe("searchApiBackends", searchValue);

    // Fetch ApiBackend documents
    var searchResults = ApiBackends.find().fetch();

    // Count the amount of api backends found
    var searchResultsCount = searchResults.length;

    // Assign amount of search results to a reactive variable
    instance.searchResultsCount.set(searchResultsCount);

    // Iterate through all documents
    _.each(searchResults, function (result) {

      // Return to user human-readable timestamp
      result.relative_created_at = moment(result.created_at).fromNow();
    });

    return searchResults;

  },
  searchResultsCount: function () {

    // Get reference to Template instance
    var instance = Template.instance();

    // Get the amount of api backends found from reactive var
    var searchResultsCount = instance.searchResultsCount.get();

    return searchResultsCount;
  }
});

Template.search.events({
  "keyup #search-text": function (event, template) {

    event.preventDefault();

    // Get reference to Template instance
    var instance = Template.instance();

    // Get search text from a text field.
    var searchValue = $('#search-text').val();

    // Assign searchValue to a reactive variable
    instance.searchValue.set(searchValue);

    return false;
  },
  "submit #search-form": function (event, template) {

    event.preventDefault();

    // Get search text from a text field.
    var searchValue = $('#search-text').val();

    // Update current page URL with updated search value
    Router.go('search', {}, {query: 'q='+searchValue});

    return false;
  }
});
