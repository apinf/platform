import { Apis } from '/apis/collection/apis';
import moment from 'moment';

Template.search.created = function () {
  // Get reference to Template instance
  var instance = this;

  // Init reactive var for search value with empty string for all results
  instance.searchValue = new ReactiveVar('');

  // Init the query reactive variable
  instance.query = new ReactiveVar();

  // Check if search parameter is set
  if (Router.current().params.query.q) {
    // Get the query string parameter
    var searchValue = Router.current().params.query.q;

    // Assign current search value to the reactive variable
    instance.searchValue.set(searchValue);
  }

  instance.autorun(function () {
    var searchValue = instance.searchValue.get();

    // Update API Backends subscription with search value
    instance.subscribe("searchApiBackends", searchValue);

    // Construct query using regex using search value
    instance.query.set({
      $or: [
        {
          name: {
            $regex: searchValue,
            $options: 'i' // case-insensitive option
          }
        },
        {
          url: {
            $regex: searchValue,
            $options: 'i' // case-insensitive option
          }
        }
      ]
    });
  });

  instance.getSearchResults = function () {
    var query = instance.query.get();
    return Apis.find(query).fetch();
  };
};

Template.search.rendered = function () {
  // Get reference to Template
  var instance = this;

  // Update search field with current search value
  $('#search-text').val(instance.searchValue.get());

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

    // Init search results variable
    var searchResults = instance.getSearchResults();

    if (searchResults !== undefined) {
      // Iterate through all documents
      _.each(searchResults, function (result) {

        // Return to user human-readable timestamp
        result.relative_created_at = moment(result.created_at).fromNow();
      });
    }
    return searchResults;
  },
  searchResultsCount: function () {
    // Get reference to Template instance
    var instance = Template.instance();

    // Get the amount of api backends found from reactive var
    var searchResultsCount = instance.getSearchResults().length;

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

    // Set query parameter to value of search text
    UniUtils.url.setQuery("q", searchValue);

    return false;
  }
});
