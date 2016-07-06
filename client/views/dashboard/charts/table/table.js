Template.dataTable.onCreated(function () {

  const instance = this; // Get reference to template instance

  instance.rowCount = new ReactiveVar(10); // Add initial row count to a table
  instance.pageNumber = new ReactiveVar(0); // Add inital page number

});

Template.dataTable.events({
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
})

Template.dataTable.helpers({
  tableDataSet () {

    const instance = Template.instance(); // Get reference to template instance

    const rowCount = instance.rowCount.get(); // Get table row count
    const pageNumber = instance.pageNumber.get(); // Get current page number

    // Get start and end value positions in array for current page
    const arrStart = rowCount * pageNumber;
    const arrEnd = arrStart + rowCount;

    console.log(arrStart, arrEnd)

    // Slice array for current page
    return Template.currentData().tableDataSet.slice(arrStart, arrEnd);
  },
  showPrevButton () {

    const instance = Template.instance(); // Get reference to template instance

    const pageNumber = instance.pageNumber.get(); // Ger current page number

    return pageNumber > 0; // Check if current page is the first one in table
  },
  showNextButton () {

    const instance = Template.instance(); // Get reference to template instance

    const rowCount = instance.rowCount.get(); // Get table row count
    const pageNumber = instance.pageNumber.get(); // Get current page number

    // Get table dataset length
    const dataSetLength = Template.currentData().tableDataSet.length;

    // Check if current page is the last one in the table
    return pageNumber < (dataSetLength / rowCount);
  },
  currentPageNumber () {

    const instance = Template.instance(); // Get reference to a template instance

    return instance.pageNumber.get() + 1; // Get current page number
  },
  totalPageNumber () {

    // Get reference to template instance
    const instance = Template.instance();

    // Get row count
    const rowCount = instance.rowCount.get();

    // Get table dataset length
    const dataSetLength = Template.currentData().tableDataSet.length;

    // Calculate total page number and make it integer
    return (dataSetLength / rowCount) + 1 | 0;
  },
  totalEntitiesCount () {

    // Get table dataset length
    return Template.currentData().tableDataSet.length;
  }
})
