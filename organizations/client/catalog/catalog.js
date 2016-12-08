import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Organizations } from '/organizations/collection';

Template.organizationCatalog.onCreated(function () {
  const instance = this;

  // Set initial settings of pagination
  instance.pagination = new Meteor.Pagination(Organizations, {
    // Count of cards in catalog
    perPage: 24,
    // Set sort by name on default
    sort: { name: 1 },
  });

  // Set up toolbar reactive variables
  instance.sortBy = new ReactiveVar('name');
  instance.sortDirection = new ReactiveVar('1');
  instance.viewMode = new ReactiveVar('grid');

  // Subscribe to Organization logo collection
  instance.subscribe('allOrganizationLogo');

  instance.autorun(() => {
    // Watch for changes in the sort settings
    const sortBy = instance.sortBy.get();
    const sortDirection = instance.sortDirection.get();

    // Create a object for storage sorting parameters
    const sort = {};

    // Get field and direction of sorting
    switch (sortBy) {
      case 'name':
        sort.name = parseInt(sortDirection);
        break;
      case 'createdAt':
        sort.createdAt = parseInt(sortDirection);
        break;
      default:
        break;
    }

    // Change sorting
    instance.pagination.sort(sort);
  });
});

Template.organizationCatalog.onRendered(function () {
  // Activate tooltips on all relevant items
  $('.toolbar-tooltip').tooltip({ placement: 'bottom' });
});

Template.organizationCatalog.helpers({
  organizations () {
    // Return items of organization collection via Pagination
    return Template.instance().pagination.getPage();
  },
  gridViewMode () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === 'grid');
  },
  tableViewMode () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get view mode from template
    const viewMode = instance.viewMode.get();

    return (viewMode === 'table');
  },
  templatePagination () {
    // Get reference of pagination
    return Template.instance().pagination;
  },
});

Template.organizationCatalog.events({
  'change [name=view-mode]': function (event, templateInstance) {
    // Get selected view mode
    const viewMode = event.target.value;

    // Update the instance view mode reactive variable
    templateInstance.viewMode.set(viewMode);
  },
  'change [name=sort-menu]': function (event, templateInstance) {
    // Get selected sort value
    const sortBy = event.target.value;

    // Update the instance sort value reactive variable
    templateInstance.sortBy.set(sortBy);
  },
  'change [name=sort-direction]': function (event, templateInstance) {
    // Get selected sort direction
    const sortDirection = event.target.value;

    // Update the instance sort direction reactive variable
    templateInstance.sortDirection.set(sortDirection);
  },
});
