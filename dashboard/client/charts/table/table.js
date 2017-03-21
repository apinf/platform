/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

Template.dashboardDataTable.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Add initial row count to a table
  instance.rowCount = new ReactiveVar(10);

  // Add inital page number
  instance.pageNumber = new ReactiveVar(0);
});

Template.dashboardDataTable.onRendered(() => {
  // Activate help icons
  $('[data-toggle="popover"]').popover();
});

Template.dashboardDataTable.events({
  'click #prev': function (event, templateInstance) {
    // Get current page number
    const currentPageNumber = templateInstance.pageNumber.get();

    // Check if page number the first page in the table
    if (currentPageNumber > 0) {
      // Decrement page number value
      templateInstance.pageNumber.set(currentPageNumber - 1);
    }
  },
  'click #next': function (event, templateInstance) {
    // Get current page number
    const currentPageNumber = templateInstance.pageNumber.get();

    // Get table row count
    const rowCount = templateInstance.rowCount.get();

    // Get table dataset length
    const dataSetLength = Template.currentData().tableData.length;

    // Check if current page is the last one in the table
    if (currentPageNumber < ((dataSetLength / rowCount) - 1)) {
      // Increment page number
      templateInstance.pageNumber.set(currentPageNumber + 1);
    }
  },
  'change #change-row-count': function (event, templateInstance) {
    // Prevent default form submit
    event.preventDefault();

    // Get row count value from form
    const rowCountValue = $('#row-count').val();

    // Parse value to int
    const newRowCount = parseInt(rowCountValue, 10);

    // Update reactive variable
    templateInstance.rowCount.set(newRowCount);
  },
});

Template.dashboardDataTable.helpers({
  tableData () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get table row count
    const rowCount = instance.rowCount.get();

    // Get current page number
    const pageNumber = instance.pageNumber.get();

    // Get start and end value positions in array for current page
    const arrStart = rowCount * pageNumber;
    const arrEnd = arrStart + rowCount;

    // Slice array for current page
    return Template.currentData().tableData.slice(arrStart, arrEnd);
  },
  showPrevButton () {
    // Get reference to template instance
    const instance = Template.instance();

    // Ger current page number
    const pageNumber = instance.pageNumber.get();

    // Check if current page is the first one in table
    return pageNumber > 0;
  },
  showNextButton () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get table row count
    const rowCount = instance.rowCount.get();

    // Get current page number
    const pageNumber = instance.pageNumber.get();

    // Get table dataset length
    const dataSetLength = Template.currentData().tableData.length;

    // Check if current page is the last one in the table
    return pageNumber < ((dataSetLength / rowCount) - 1);
  },
  currentPageNumber () {
    // Get reference to a template instance
    const instance = Template.instance();

    // Get current page number
    return instance.pageNumber.get() + 1;
  },
  totalPageNumber () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get row count
    const rowCount = instance.rowCount.get();

    // Get table dataset length
    const dataSetLength = Template.currentData().tableData.length;

    // Calculate total page number and make it integer
    return ((dataSetLength / rowCount) + 1) | 0;
  },
});
