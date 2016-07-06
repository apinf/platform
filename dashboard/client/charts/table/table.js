Template.dashboardDataTable.onCreated(function () {

  const instance = this; // Get reference to template instance

  instance.rowCount = new ReactiveVar(10); // Add initial row count to a table
  instance.pageNumber = new ReactiveVar(1); // Add inital page number

});

Template.dashboardDataTable.events({
  'click #prev': function (event, instance) {

    let currentPageNumber = instance.pageNumber.get(); // Get current page number

    // Check if page number the first page in the table
    if (currentPageNumber > 1) {

      instance.pageNumber.set(currentPageNumber - 1); // Decrement page number value
    }
  },
  'click #next': function (event, instance) {

    let currentPageNumber = instance.pageNumber.get(); // Get current page number

    const rowCount = instance.rowCount.get(); // Get table row count
    const dataSetLength = Template.currentData().tableDataSet.length; // Get table dataset length

    // Check if current page is the last one in the table
    if (currentPageNumber < (dataSetLength / rowCount) - 1) {

      instance.pageNumber.set(currentPageNumber + 1); // Increment page number
    }
  }
})

Template.dashboardDataTable.helpers({
  tableDataSet () {

    const instance = Template.instance(); // Get reference to template instance

    const rowCount = instance.rowCount.get(); // Get table row count
    const pageNumber = instance.pageNumber.get(); // Get current page number

    // Get start and end value positions in array for current page
    const arrStart = rowCount * pageNumber;
    const arrEnd = arrStart + rowCount;

    // Slice array for current page
    return Template.currentData().tableDataSet.slice(arrStart, arrEnd);
  },
  showPrevButton () {

    const instance = Template.instance(); // Get reference to template instance

    const pageNumber = instance.pageNumber.get(); // Ger current page number

    return pageNumber > 1; // Check if current page is the first one in table
  },
  showNextButton () {

    const instance = Template.instance(); // Get reference to template instance

    const rowCount = instance.rowCount.get(); // Get table row count
    const pageNumber = instance.pageNumber.get(); // Get current page number

    // Get table dataset length
    const dataSetLength = Template.currentData().tableDataSet.length;

    // Check if current page is the last one in the table
    return pageNumber < (dataSetLength / rowCount - 1);
  },
  currentPageNumber () {

    const instance = Template.instance(); // Get reference to a template instance

    return instance.pageNumber.get(); // Get current page number
  },
  totalPageNumber () {

    const instance = Template.instance(); // Get reference to template instance

    const rowCount = instance.rowCount.get(); // Get row count

    // Get table dataset length
    const dataSetLength = Template.currentData().tableDataSet.length;

    return (dataSetLength / rowCount) | 0; // Calculate total page number and make it integer
  }
})
