import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Apis } from '/apis/collection/apis';

import _ from 'lodash';

Template.catalogue.onCreated(function () {

  const instance = this;

  // Set up toolbar reactive variables
  instance.sortBy = new ReactiveVar("name");
  instance.sortDirection = new ReactiveVar("ascending");
  instance.filterBy = new ReactiveVar("show-all");
  instance.viewMode = new ReactiveVar("grid");


  // Pagination
  instance.apisPerPage = new ReactiveVar(24);
  instance.currentPageNumber = new ReactiveVar(0);
  instance.pages = new ReactiveVar([]);

  // Subscribe to API logo colection
  instance.subscribe("allApiLogo");

  // Subscribe to Meteor.users to show authors. Show only visible authors.
  instance.subscribe("allUsers");

  // Gerenates new page numbers array every time current page changes
  instance.generatePageNumbers = function () {

    let pages = [];

    const currentPageNumber = instance.currentPageNumber.get() + 1;
    const apisCount = Apis.find().count();
    const apisPerPage = instance.apisPerPage.get();
    const totalPagesCount = (apisCount / apisPerPage + 1) | 0;

    // Create list with all the page numbers
    for (let i = 1; i < totalPagesCount+1; i++) {
      pages.push(i);
    }

    // Check if total page count is bigger than 9
    // To be able to generate sliced pagination
    // Otherwise gerenate complete pages list
    if (totalPagesCount >= 9) {

      // For current page number range shorten pages array, replace nums with '...':
      // 1. n <= 4
      // 2. n > 4 && n < total-4
      // 3. n >= total-4
      // n - current page number; total - total pages amount
      if (currentPageNumber <= 4) {

        pages = _.concat(_.take(pages, 5), '...', _.takeRight(pages, 1));

      } else if (currentPageNumber > 4 && currentPageNumber < pages[pages.length-4]) {

        pages = _.concat(_.take(pages, 1), '...', currentPageNumber-1, currentPageNumber, currentPageNumber+1, '...', _.takeRight(pages, 1));

      } else if (currentPageNumber >= pages[pages.length-4]) {

        pages = _.concat(_.take(pages, 1), '...', _.takeRight(pages, 5));
      }
    }

    instance.pages.set(pages);
  }

  instance.autorun(function () {
    // Watch for changes in the sort and filter settings
    const sortBy = instance.sortBy.get();
    const sortDirection = instance.sortDirection.get();
    const filterBy = instance.filterBy.get();

    // Set up object for mongodb subscription options
    const subscriptionOptions = {
      sortBy,
      sortDirection,
      filterBy
    };

    // Subscribe to API Backends with catalogue settings
    instance.subscribe("catalogue", subscriptionOptions);

    // Update pagination
    instance.generatePageNumbers();
  });
});

Template.catalogue.onRendered(function () {
  // Activate tooltips on all relevant items
  $(".toolbar-tooltip").tooltip({ placement: 'bottom'});
});

Template.catalogue.helpers({
  // Catalogue
  apiBackendsCount () {
    // Count the number of API Backends in current subscription
    return Apis.find().count();
  },
  apiBackends () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get sort settings
    let sortBy = instance.sortBy.get();
    let sortDirection = instance.sortDirection.get();

    // Override sortDirection to match MongoDB syntax
    if (sortDirection === "ascending") {
      sortDirection = 1;
    } else {
      sortDirection = -1;
    }

    // Set up sort options placeholder object
    const sortOptions = { sort: { } };

    // Set the sort by field and direction within sortOptions
    sortOptions.sort[sortBy] = sortDirection;

    // Get sorted list of API Backends
    const apis = Apis.find({}, sortOptions).fetch();

    // Pagination
    const arrStart = instance.apisPerPage.get() * instance.currentPageNumber.get();
    const arrEnd = arrStart + instance.apisPerPage.get();

    return apis.slice(arrStart, arrEnd);
  },
  gridViewMode () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === "grid");
  },
  tableViewMode () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === "table");
  },
  // Pagination
  currentPageNumber () {
    const instance = Template.instance();
    return instance.currentPageNumber.get() + 1;
  },
  totalPagesCount () {
    const instance = Template.instance();
    const apisCount = Apis.find().count();
    const apisPerPage = instance.apisPerPage.get();

    // Calculate total pages cound and round
    return (apisCount / apisPerPage + 1) | 0;
  },
  prevButtonDisabledClass () {

    // Get reference to template instance
    const instance = Template.instance();

    // Ger current page number
    const currentPageNumber = instance.currentPageNumber.get();

    // Check if current page is not the first one in table
    if (currentPageNumber > 0) {
      return '';
    }

    return 'inactive';
  },
  nextButtonDisabledClass () {

    // Get reference to template instance
    const instance = Template.instance();

    // Get table row count
    const apisPerPage = instance.apisPerPage.get();

    // Get current page number
    const currentPageNumber = instance.currentPageNumber.get();

    // Get table dataset length
    const apisCount = Apis.find().count();

    // Check if current page is not the last one in the table
    if (currentPageNumber < (apisCount / apisPerPage - 1)) {
      return '';
    }
    return 'inactive';
  },
  pageNumbers () {
    const instance = Template.instance();
    return instance.pages.get();
  },
  pageIsActive (pageNumber) {
    const instance = Template.instance();

    // Check if current page is active
    if ((instance.currentPageNumber.get() + 1) === pageNumber) {
      return 'active';
    } else if (pageNumber === '...') {
      return 'inactive'
    }

    return '';
  }
});

Template.catalogue.events({
  // Catalogue
  'change #sort-select' (event, instance) {
    // Get selected sort value
    const sortBy = event.target.value;

    // Update the instance sort value reactive variable
    instance.sortBy.set(sortBy);
  },
  'change [name=sort-direction]' (event, instance) {
    // Get selected sort value
    const sortDirection = event.target.value;

    // Update the instance sort value reactive variable
    instance.sortDirection.set(sortDirection);
  },
  'change [name=filter-options]' (event, instance) {
    // Get selected sort value
    const filterBy = event.target.value;

    // Update the instance sort value reactive variable
    instance.filterBy.set(filterBy);
  },
  'change [name=view-mode]' (event, instance) {
    // Get selected sort value
    const viewMode = event.target.value;

    // Update the instance sort value reactive variable
    instance.viewMode.set(viewMode);
  },
  // Pagination
  'click #prev-page': function (event, instance) {

    const currentPageNumber = instance.currentPageNumber.get();

    if (currentPageNumber > 0) {

      // Turn the page forward if check above passed
      instance.currentPageNumber.set(currentPageNumber - 1);
    }
  },
  'click #next-page': function (event, instance) {

    const currentPageNumber = instance.currentPageNumber.get();

    const apisPerPage = instance.apisPerPage.get();

    const apisCount = Apis.find().count();

    // Check if page is not last one
    if (currentPageNumber < (apisCount / apisPerPage - 1)) {

      // Turn the page backwards if check above passed
      instance.currentPageNumber.set(currentPageNumber + 1);
    }
  },
  'click .change-page': function (event, instance) {

    // get clicked page number
    const newPageNumber = $(event.currentTarget).text();

    // Make sure that that value is a number
    if (newPageNumber !== '...') {
      // Parse string to int and normalize
      const newPageNumberParsed = parseInt(newPageNumber) - 1;
      instance.currentPageNumber.set(newPageNumberParsed);
    }
  }
});
