/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Npm packages imports
// TODO reference moment library in the code.
// eslint-disable-next-line no-unused-vars
import moment from 'moment';
import 'moment/min/locales.min';

// Collection imports
import Apis from '/packages/apis/collection';

Template.search.onCreated(function () {
  // Get reference to Template instance
  const instance = this;

  // Init reactive var for search value with empty string for all results
  instance.searchValue = new ReactiveVar('');

  // Init the query reactive variable
  instance.query = new ReactiveVar();

  // Check if search parameter is set
  if (FlowRouter.getQueryParam('q')) {
    // Get the query string parameter
    const searchValue = FlowRouter.getQueryParam('q');

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
            $options: 'i', // case-insensitive option
          },
        },
        {
          backend_host: {
            $regex: searchValue,
            $options: 'i', // case-insensitive option
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

Template.search.onRendered(function () {
  // Get reference to Template
  const instance = this;

  // Update search field with current search value
  instance.$('#search-field').val(instance.searchValue.get());

  // Check if search parameter is set
  if (instance.searchValue.get()) {
    // Update search field with search value provided in the URL
    instance.$('#search-field').val(instance.searchValue.get());
  }

  // Put focus of search field on a page
  instance.$('#search-field').focus();
});

Template.search.helpers({
  searchResults () {
    // Get reference to Template instance
    const instance = Template.instance();

    // Init search results variable
    const searchResults = instance.getSearchResults();

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
  'keyup #search-field': function (event) {
    event.preventDefault();

    // Get reference to Template instance
    const instance = Template.instance();

    // Get search text from a text field.
    const searchValue = instance.$('#search-field').val();

    // Assign searchValue to a reactive variable
    instance.searchValue.set(searchValue);

    // Set query parameter to value of search text
    FlowRouter.setQueryParams({ q: searchValue });

    return false;
  },
  'submit #search-form': function (event) {
    // Prevent the 'submit' event
    event.preventDefault();
  },
});
