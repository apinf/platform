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
import moment from 'moment';
import dc from 'dc';
import d3 from 'd3';
import crossfilter from 'crossfilter';
import _ from 'lodash';

Template.dashboardCharts.onCreated(function () {
  const instance = this;

  // Variable that keeps table data
  instance.tableData = new ReactiveVar([]);

  // Variable that keeps frontend prefix
  instance.frontendPrefix = new ReactiveVar();

  // Variable that keeps loading state value
  // Possible loading state values:
  // 'not-loading'
  // 'loading'
  // 'data-not-found'
  // 'done'
  instance.loadingState = new ReactiveVar('not-loading');

  // Init default values for statistic data
  instance.requestsCount = new ReactiveVar(0);
  instance.averageResponseTime = new ReactiveVar(0);
  instance.responseRate = new ReactiveVar(0);
  instance.uniqueUsersCount = new ReactiveVar(0);

  // Init date formats for each user-case
  instance.analyticsTickDateFormat = {
    d3: {
      hour: '%Y-%m-%d-%H',
      day: '%Y-%m-%d',
      week: '%Y-%m-%W',
      month: '%Y-%m',
    },
    moment: {
      hour: 'YYYY-MM-DD-HH',
      day: 'YYYY-MM-DD',
      week: 'YYYY-MM-ww',
      month: 'YYYY-MM',
    },
  };

  // Init reactive vars that keep timestamp in default format (hour tick)
  instance.timeStampFormatD3 = new ReactiveVar(instance.analyticsTickDateFormat.d3.hour);
  instance.timeStampFormatMoment = new ReactiveVar(instance.analyticsTickDateFormat.moment.hour);

  // Parse elasticsearch data into timescales, dimensions & groups for DC.js
  instance.parseChartData = (items) => {
    // Create crossfilter
    // eslint-disable-next-line new-cap
    const index = new crossfilter(items);

    // Init dateformat for charts
    const dateFormat = d3.time.format(instance.timeStampFormatD3.get());

    // Create dimension based on a timestamp
    const timeStampDimension = index.dimension((d) => {
      let timeStamp = moment(d.fields.request_at[0]);

      // Format timestamp
      timeStamp = timeStamp.format(instance.timeStampFormatMoment.get());
      // Check if timestamp formats match
      d.fields.ymd = dateFormat.parse(timeStamp);

      return d.fields.ymd;
    });

    // Create timestamp group
    const timeStampGroup = timeStampDimension.group();

    // Create dimension based on status code
    const statusCodeDimension = index.dimension((d) => {
      const statusCode = d.fields.response_status[0];

      let statusCodeScope = '';

      // Init regEx for status codes
      const success = /^2[0-9][0-9]$/;
      const redirect = /^3[0-9][0-9]$/;
      const clientErr = /^4[0-9][0-9]$/;
      const serverErr = /^5[0-9][0-9]$/;

      // Find out in which scope status code is
      if (success.test(statusCode)) {
        statusCodeScope = '2XX';
      } else if (redirect.test(statusCode)) {
        statusCodeScope = '3XX';
      } else if (clientErr.test(statusCode)) {
        statusCodeScope = '4XX';
      } else if (serverErr.test(statusCode)) {
        statusCodeScope = '5XX';
      }

      return statusCodeScope;
    });

    // Create status code group
    const statusCodeGroup = statusCodeDimension.group();

    // Init binwidth for a bar chart
    const binwidth = 50;

    // Get MIN and MAX response time values
    const minResponseTime = d3.min(items, (d) => { return d.fields.response_time[0]; });

    // Create dimension based on response time
    const responseTimeDimension = index.dimension((d) => { return d.fields.response_time[0]; });

    // Create response time group
    const responseTimeGroup = responseTimeDimension.group((d) => {
      return binwidth * Math.floor(d / binwidth);
    });

    // Group add dimensions
    const all = index.groupAll();

    // Keep data counters on a dashboard updated
    dc.dataCount('#row-selection')
      .dimension(index)
      .group(all);

    // Get MIN and MAX timestamp values
    const minDate = d3.min(items, (d) => { return d.fields.ymd; });
    const maxDate = d3.max(items, (d) => { return d.fields.ymd; });

    // Init scales for axis
    const timeScaleForLineChart = d3.time.scale().domain([minDate, maxDate]);
    const timeScaleForRangeChart = d3.time.scale().domain([minDate, maxDate]);
    const xScaleForBar = d3.scale.pow().domain([minResponseTime, 1000]);

    return {
      timeStampDimension,
      timeStampGroup,
      statusCodeDimension,
      statusCodeGroup,
      responseTimeDimension,
      responseTimeGroup,
      timeScaleForLineChart,
      timeScaleForRangeChart,
      xScaleForBar,
      binwidth,
    };
  };

  // Render charts on the page
  instance.renderCharts = (parsedData) => {
    const {
      timeStampDimension,
      timeStampGroup,
      statusCodeDimension,
      statusCodeGroup,
      responseTimeDimension,
      responseTimeGroup,
      timeScaleForLineChart,
      timeScaleForRangeChart,
      xScaleForBar,
      binwidth,
    } = parsedData;

    // Init charts
    const requestsOverTime = dc.lineChart('#requestsOverTime-chart');
    const overviewChart = dc.barChart('#overviewChart-chart');
    const statusCodeCounts = dc.rowChart('#statusCodeCounts-chart');
    const responseTimeDistribution = dc.barChart('#responseTimeDistribution-chart');

    requestsOverTime
      .height(350)
      .renderArea(true)
      .transitionDuration(300)
      .margins({ top: 5, right: 20, bottom: 25, left: 40 })
      .ordinalColors(['#2fa4e7'])
      .x(timeScaleForLineChart)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .rangeChart(overviewChart)
      .brushOn(false)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .elasticY(true);

    overviewChart
      .height(100)
      .dimension(timeStampDimension)
      .group(timeStampGroup)
      .xUnits(dc.units.fp.precision(binwidth))
      .centerBar(true)
      .gap(1)
      .margins({ top: 5, right: 20, bottom: 25, left: 40 })
      .ordinalColors(['#2fa4e7'])
      .x(timeScaleForRangeChart)
      .alwaysUseRounding(true)
      .elasticY(true)
      .yAxis()
      .ticks(0);

    statusCodeCounts
      .height(215)
      .transitionDuration(300)
      .dimension(statusCodeDimension)
      .group(statusCodeGroup)
      // Correspond to bootstrap color classes
      .ordinalColors(['#28ae4f', '#ffc107', '#e15400', '#cc1410'])
      .elasticX(true)
      .xAxis()
      .ticks(5);

    responseTimeDistribution
      .height(215)
      .transitionDuration(300)
      .dimension(responseTimeDimension)
      .group(responseTimeGroup)
      .centerBar(true)
      .xUnits(dc.units.fp.precision(binwidth))
      .margins({ top: 5, right: 20, bottom: 25, left: 45 })
      .ordinalColors(['#2fa4e7'])
      .brushOn(true)
      .x(xScaleForBar)
      .renderHorizontalGridLines(true)
      .xAxis()
      .ticks(10);

    dc.renderAll(); // Render all charts

    // Get chart data from dc registry
    const chartData = timeStampDimension.top(Infinity);

    // Iterate throuh each chart in a registry & set listeners for filtering
    _.forEach(dc.chartRegistry.list(), (chart) => {
      chart.on('filtered', () => {
        const filteredChartData = timeStampDimension.top(Infinity);
        instance.updateDataTable(filteredChartData);
        instance.updateLineChart(requestsOverTime, overviewChart, timeScaleForLineChart);
        instance.updateStatisticsData(filteredChartData);
      });
    });

    instance.updateDataTable(chartData);
    instance.updateStatisticsData(chartData);
  };

  // Function that updates table data
  instance.updateDataTable = (chartData) => {
    const tableData = [];

    _.forEach(chartData, (e) => {
      let time;
      let country;
      let requestPath;
      let requestIp;
      let responseTime;
      let responseStatus;

      // The time is saved in UTC ,so converting the time to users local time using .toDate()
      let localTime = moment.utc(e.fields.request_at[0]).toISOString();
      localTime = moment.utc(localTime).toDate();

      try { time = localTime; } catch (err) { time = ''; }

      try { country = e.fields.request_ip_country[0]; } catch (err) { country = ''; }

      try { requestPath = e.fields.request_path[0]; } catch (err) { requestPath = ''; }

      try { requestIp = e.fields.request_ip[0]; } catch (err) { requestIp = ''; }

      try { responseTime = e.fields.response_time[0]; } catch (err) { responseTime = ''; }

      try { responseStatus = e.fields.response_status[0]; } catch (err) { responseStatus = ''; }

      tableData.push({ time, country, requestPath, requestIp, responseTime, responseStatus });
    });

    instance.tableData.set(tableData);
  };

  // Function that updates time scale for line chart
  instance.updateLineChart = (requestsOverTime, overviewChart, timeScaleForLineChart) => {
    // Get current time range
    const selectedTimeRange = overviewChart.filter();

    // Check if filter was set
    if (selectedTimeRange) {
      requestsOverTime.x(d3.time.scale().domain(selectedTimeRange));
    } else {
      requestsOverTime.x(timeScaleForLineChart);
    }
  };

  // Function that fiters analytics data based on frontend prefix
  instance.filterData = (requests, frontendPrefix) => {
    instance.updateStatisticsData(requests);

    // Filter data based on matches with API frontend prefix
    const matchingProxyRequests = _.filter(requests, (request) => {
      // Get request path for comparison
      const requestPath = request.fields.request_path[0];

      // Check if request path matches frontent prefix
      return (requestPath === frontendPrefix);
    });

    return matchingProxyRequests;
  };

  // Functions that updates statistics data
  instance.updateStatisticsData = function (chartData) {
    // Get statistics sata
    const getRequestsCount = instance.getRequestsCount(chartData);
    const getAverageResponseTime = instance.getAverageResponseTime(chartData);
    const getResponseRate = instance.getResponseRate(chartData);
    const getUniqueUsersCount = instance.getUniqueUsersCount(chartData);

    // Set statistics data
    instance.requestsCount.set(getRequestsCount);
    instance.averageResponseTime.set(getAverageResponseTime);
    instance.responseRate.set(getResponseRate);
    instance.uniqueUsersCount.set(getUniqueUsersCount);
  };

  // Function that returns chart items count
  instance.getRequestsCount = (chartData) => { return chartData.length; };

  // Function that returns average response time
  instance.getAverageResponseTime = (chartData) => {
    // Get average response time value
    const averageResponseTime = _.meanBy(chartData, (item) => {
      return item.fields.response_time[0];
    });

    // Round average response time value
    const roundedAverageResponseTime = _.round(averageResponseTime);

    // Check if value is not a number
    if (!isNaN(roundedAverageResponseTime)) {
      // Round it before return
      return roundedAverageResponseTime;
    }

    // Return 0 if the final value is NaN
    return 0;
  };

  // Function that returns response rate
  instance.getResponseRate = (chartData) => {
    // Group chart data by response status code
    const responseStatusCodeGroup = _.groupBy(chartData, (item) => {
      return item.fields.response_status[0];
    });

    try {
      // Get the amount of success status codes
      const successStatusCodeCount = responseStatusCodeGroup['200'].length;

      // Get total amout of records in the chart
      const chartItemsCount = chartData.length;

      // Calculate average response rate based on success (200) status code in persentage
      const responseRate = (successStatusCodeCount / chartItemsCount) * 100;

      // Roound it before return
      return _.round(responseRate);
    } catch (e) {
      // Return 0 if there are no 200 codes
      return 0;
    }
  };

  // Function that returns amount of unique users
  instance.getUniqueUsersCount = (chartData) => {
    // Group unique users by user ID
    const uniqueUsersGroup = _.groupBy(chartData, (item) => {
      try {
        return item.fields.user_id[0];
      } catch (e) {
        return false;
      }
    });

    // Remove object key with no-user data
    delete uniqueUsersGroup.false;

    // Return the amount of users in object
    return Object.keys(uniqueUsersGroup).length;
  };

  // Loading state controller
  instance.updateLoadingState = (chartData) => {
    // Check if data is loaded
    if (chartData) {
      // Check if chart data was found
      if (chartData.length > 0) {
        // If found, Hide all messages
        instance.loadingState.set('done');
      } else {
        // If not, display "not found" message to user
        instance.loadingState.set('data-not-found');
      }
    } else {
      // If still loading, show loading state to user
      instance.loadingState.set('loading');
    }
  };
});

Template.dashboardCharts.onRendered(function () {
  const instance = this;

  // Update loader to state 1
  instance.loadingState.set('loading');

  instance.autorun(() => {
    // Get chart data, reactively
    const chartData = Template.currentData().chartData;

    // Get granularity from URL parameter
    const granularity = FlowRouter.getQueryParam('granularity');

    // Get date formats for D3 and moment
    const timeStampFormatD3 = instance.analyticsTickDateFormat.d3[granularity];
    const timeStampFormatMoment = instance.analyticsTickDateFormat.moment[granularity];

    // Update charts tick based on URL parameters
    instance.timeStampFormatD3.set(timeStampFormatD3);
    instance.timeStampFormatMoment.set(timeStampFormatMoment);

    const frontendPrefix = instance.frontendPrefix.get();

    // Update loading state
    instance.updateLoadingState(chartData);

    if (chartData && chartData.length > 0) {
      let parsedData = [];

      if (frontendPrefix) {
        // Filter data by frontend prefix
        const filteredData = instance.filterData(chartData, frontendPrefix);

        // Parse data for charts
        parsedData = instance.parseChartData(filteredData);
      } else {
        // Parse data for charts
        parsedData = instance.parseChartData(chartData);
      }

      // Render charts
      instance.renderCharts(parsedData);
    }
  });
});

Template.dashboardCharts.helpers({
  tableData () {
    const instance = Template.instance();

    return instance.tableData.get();
  },
  statisticsData () {
    const instance = Template.instance();

    return {
      requestsCount: instance.requestsCount.get(),
      averageResponseTime: instance.averageResponseTime.get(),
      responseRate: instance.responseRate.get(),
      uniqueUsersCount: instance.uniqueUsersCount.get(),
    };
  },
  loadingState () {
    return Template.instance().loadingState.get();
  },
  isEqual (currentState, state) {
    return currentState === state;
  },
});
