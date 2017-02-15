// Meteor packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.timeFrameSelectPicker.onRendered(() => {
  $('#timeframe-datepickers').datepicker({
    todayHighlight: true,
    endDate: 'today',
    autoclose: true,
  });

  // Event handler for timeframe start
  $('#analytics-timeframe-start').datepicker()
  // Save chosen date to URL parameter
  // in order to share dashboard state
  .on('changeDate', (event) => {
    // Modifies the current history entry instead of creating a new one
    FlowRouter.withReplaceState(() => {
      // Set fromDate URL parameter to ISO YYYY-mm-dd
      FlowRouter.setQueryParams({ fromDate: event.format('yyyy-mm-dd') });
    });
  });

  // Check URL parameters for 'from date' for analytics timeframe
  const fromDate = FlowRouter.getQueryParam('fromDate');

  // Set the start date based on URL parameters, if available
  if (fromDate) {
    $('#analytics-timeframe-start').datepicker('setDate', new Date(fromDate));
  }

  // Event handler for timeframe end
  $('#analytics-timeframe-end').datepicker()
  // Save chosen date to URL parameter
  .on('changeDate', (event) => {
    // Modifies the current history entry instead of creating a new one
    FlowRouter.withReplaceState(() => {
      // Set fromDate URL parameter to ISO YYYY-mm-dd
      // in order to share dashboard state
      FlowRouter.setQueryParams({ toDate: event.format('yyyy-mm-dd') });
    });
  });

  // Check URL parameters for 'from date' for analytics timeframe
  const toDate = FlowRouter.getQueryParam('toDate');

  // Set the start date based on URL parameters, if available
  if (toDate) {
    $('#analytics-timeframe-end').datepicker('setDate', new Date(toDate));
  }
});
