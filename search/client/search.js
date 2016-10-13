// Meteor packages import
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Router } from 'meteor/useraccounts:iron-routing';

// APINF import
import { Apis } from '/apis/collection';
// npm import
import moment from 'moment';

Template.search.onCreated(() => {
  // Get reference to Template instance
  const instance = this;

  // Init reactive var for search value with empty string for all results
  instance.searchValue = new ReactiveVar('');

  // Init the query reactive variable
  instance.query = new ReactiveVar();

  // Check if search parameter is set
  if (Router.current().params.query.q) {
    // Get the query string parameter
    const searchValue = Router.current().params.query.q;

    // Assign current search value to the reactive variable
    instance.searchValue.set(searchValue);
  }

  instance.autorun(() => {
    const searchValue = instance.searchValue.get();

    // Update API Backends subscription with search value
    instance.subscribe('searchApiBackends', searchValue);

    // Construct query using regex using search value
    instance.query.set({
      $or: [
        {
          name: {
            $regex: searchValue,
            $options: 'i' // case-insensitive option
          },
        },
        {
          backend_host: {
            $regex: searchValue,
            $options: 'i' // case-insensitive option
          },
        },
      ],
    });
  });

  instance.getSearchResults = function () {
    // Get query result
    const query = instance.query.get();
    // Find api in collection
    const searchResult = Apis.find(query).fetch();
    // Filter that: can current user view it or not
    const filteredResult = searchResult.filter((api) => {
      return api.currentUserCanView();
    });

    return filteredResult;
  };
});

Template.search.onRendered(() => {
  // Get reference to Template
  const instance = this;

  // Update search field with current search value
  $('#search-text').val(instance.searchValue.get());

  // Check if search parameter is set
  if (instance.searchValue.get()) {
    // Update search field with search value provided in the URL
    $('#search-text').val(instance.searchValue.get());
  }

  // Put focus of search field on a page
  $('#search-text').focus();
});

Template.search.helpers({
  searchResults () {
    // Get reference to Template instance
    const instance = Template.instance();

    // Init search results variable
    const searchResults = instance.getSearchResults();

    if (searchResults !== undefined) {
      // Iterate through all documents
      _.each(searchResults, (result) => {
        // Return to user human-readable timestamp
        result.relative_created_at = moment(result.created_at).fromNow();
      });
    }
    return searchResults;
  },
  searchResultsCount () {
    // Get reference to Template instance
    const instance = Template.instance();

    // Get the amount of api found from reactive var
    const searchResultsCount = instance.getSearchResults().length;

    return searchResultsCount;
  },
});

Template.search.events({
  'keyup #search-text': function (event, template) {
    event.preventDefault();

    // Get reference to Template instance
    const instance = Template.instance();

    // Get search text from a text field.
    const searchValue = $('#search-text').val();

    // Assign searchValue to a reactive variable
    instance.searchValue.set(searchValue);

    // Set query parameter to value of search text
    UniUtils.url.setQuery("q", searchValue);

    return false;
  },
});
