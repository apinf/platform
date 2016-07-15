Template.dashboardDataTable.onCreated(function () {

  // Get reference to template instance
  const instance = this;

  // Add initial row count to a table
  instance.rowCount = new ReactiveVar(10);

  // Add inital page number
  instance.pageNumber = new ReactiveVar(0);

});

Template.dashboardDataTable.events({
  'click #prev': function (event, instance) {

    // Get current page number
    const currentPageNumber = instance.pageNumber.get();

    // Check if page number the first page in the table
    if (currentPageNumber > 0) {

      // Decrement page number value
      instance.pageNumber.set(currentPageNumber - 1);
    }
  },
  'click #next': function (event, instance) {

    // Get current page number
    const currentPageNumber = instance.pageNumber.get();

    // Get table row count
    const rowCount = instance.rowCount.get();

    // Get table dataset length
    const dataSetLength = Template.currentData().tableDataSet.length;

    // Check if current page is the last one in the table
    if (currentPageNumber < (dataSetLength / rowCount - 1)) {

      // Increment page number
      instance.pageNumber.set(currentPageNumber + 1);
    }
  },
  'change #change-row-count': function (event, instance) {

    // Prevent default form submit
    event.preventDefault();

    // Get row count value from form
    const rowCountValue = $('#row-count').val();

    // Parse value to int
    const newRowCount = parseInt(rowCountValue);

    // Update reactive variable
    instance.rowCount.set(newRowCount);
  }
});

Template.dashboardDataTable.helpers({
  tableDataSet () {

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
    return Template.currentData().tableDataSet.slice(arrStart, arrEnd);
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
    const dataSetLength = Template.currentData().tableDataSet.length;

    // Check if current page is the last one in the table
    return pageNumber < (dataSetLength / rowCount - 1);
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
    const dataSetLength = Template.currentData().tableDataSet.length;

    // Calculate total page number and make it integer
    return (dataSetLength / rowCount + 1) | 0;
  },
  totalEntitiesCount () {

    // Get table dataset length
    return Template.currentData().tableDataSet.length;
  }
});
