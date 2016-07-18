import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { ApiBackends } from '/apis/collection/backend';

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
  });

  // Subscribe to API logo colection
  instance.subscribe("allApiLogo");

  // Subscribe to Meteor.users to show authors. Show only visible authors.
  instance.subscribe("allUsers");
});

Template.catalogue.onRendered(function () {
  // Activate tooltips on all relevant items
  $(".toolbar-tooltip").tooltip({ placement: 'bottom'});
});

Template.catalogue.helpers({
  // Catalogue
  apiBackendsCount () {
    // Count the number of API Backends in current subscription
    return ApiBackends.find().count();
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
    const apis = ApiBackends.find({}, sortOptions).fetch();

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
  totalPageNumber () {
    const instance = Template.instance();
    const apisCount = ApiBackends.find().count();
    const apisPerPage = instance.apisPerPage.get();

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

    return 'disabled';
  },
  nextButtonDisabledClass () {

    // Get reference to template instance
    const instance = Template.instance();

    // Get table row count
    const apisPerPage = instance.apisPerPage.get();

    // Get current page number
    const currentPageNumber = instance.currentPageNumber.get();

    // Get table dataset length
    const apisCount = ApiBackends.find().count();

    // Check if current page is not the last one in the table
    if (currentPageNumber < (apisCount / apisPerPage - 1)) {
      return '';
    }
    return 'disabled';
  },
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

      instance.currentPageNumber.set(currentPageNumber - 1);
    }
  },
  'click #next-page': function (event, instance) {

    const currentPageNumber = instance.currentPageNumber.get();

    const apisPerPage = instance.apisPerPage.get();

    const apisCount = ApiBackends.find().count();

    if (currentPageNumber < (apisCount / apisPerPage - 1)) {

      instance.currentPageNumber.set(currentPageNumber + 1);
    }
  }
});
