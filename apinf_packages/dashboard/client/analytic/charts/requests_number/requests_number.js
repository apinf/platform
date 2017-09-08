/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages import
import { TAPi18n } from 'meteor/tap:i18n';
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import { generateDate, arrayWithZeros } from '/apinf_packages/dashboard/client/generate_date';

// Npm packages imports
import moment from 'moment';
import Chart from 'chart.js';

Template.requestTimeline.onCreated(function () {
  const instance = this;

  instance.elasticsearchData = new ReactiveVar();

  // Chart depends on selected request path
  // Get related elasticsearch data when a user changed path
  instance.changePath = (path) => {
    // Find the related data for selected Path
    const relatedData = Template.currentData().timelineData.filter(value => {
      return value.key === path;
    });

    // Update value
    instance.elasticsearchData.set(relatedData[0]);
  };

  instance.autorun(() => {
    const timelineData = Template.currentData().timelineData;
    // On default get data for the first requested path
    instance.changePath(timelineData[0].key);
  });
});

Template.requestTimeline.onRendered(function () {
  const instance = this;

  // Realize chart
  const ctx = document.getElementById('request-timeline-chart').getContext('2d');
  instance.chart = new Chart(ctx, {
    // The type of chart
    type: 'line',
    // Data for displaying chart
    data: {
      labels: [],
      datasets: [],
    },
    // Configuration options
    options: {
      elements: {
        line: {
          tension: 0, // disables bezier curves
        },
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: TAPi18n.__('requestTimeline_xAxisTitle_days'),
              fontSize: 14,
              fontColor: '#000000',
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: TAPi18n.__('requestTimeline_yAxisTitle_requests'),
              fontSize: 14,
              fontColor: '#000000',
            },
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  // Update chart when elasticsearchData was changed
  instance.autorun(() => {
    window.moment = moment;

    // Get ElasticSearch data
    const elasticsearchData = instance.elasticsearchData.get();

    // Get aggregated data for current chart
    const aggregationData = elasticsearchData.requests_over_time.buckets;

    // Get current timeframe
    const dateCount = FlowRouter.getQueryParam('timeframe');

    const params = {
      // Date range must have equal length with dateCount value
      // Today value is included then subtract less days
      startDate: moment().subtract(dateCount - 1, 'd'),
      endDate: moment(),
      // Interval is 1 day
      step: 1,
      // TODO: internationalize date formatting
      format: 'MM/DD',
    };

    const labels = generateDate(params);
    const successCalls = arrayWithZeros(dateCount);
    const redirectCalls = arrayWithZeros(dateCount);
    const failCalls = arrayWithZeros(dateCount);
    const errorCalls = arrayWithZeros(dateCount);

    aggregationData.forEach(value => {
      // Create Labels values
      const currentDateValue = moment(value.key).format(params.format);

      const index = labels.indexOf(currentDateValue);

      // Data for requests with success statuses
      successCalls[index] = value.response_status.buckets.success.doc_count;

      // Data for requests with redirect statuses
      redirectCalls[index] = value.response_status.buckets.redirect.doc_count;

      // Data for requests with fail statuses
      failCalls[index] = value.response_status.buckets.fail.doc_count;

      // Data for requests with error statuses
      errorCalls[index] = value.response_status.buckets.error.doc_count;
    });

    // Update labels & data
    instance.chart.data = {
      labels,
      datasets: [
        {
          label: '2XX',
          backgroundColor: '#468847',
          borderColor: '#468847',
          data: successCalls,
          fill: false,
        },
        {
          label: '3XX',
          backgroundColor: '#04519b',
          borderColor: '#04519b',
          data: redirectCalls,
          fill: false,
        },
        {
          label: '4XX',
          backgroundColor: '#e08600',
          borderColor: '#e08600',
          data: failCalls,
          fill: false,
        },
        {
          label: '5XX',
          backgroundColor: '#b94848',
          borderColor: '#b94848',
          data: errorCalls,
          fill: false,
        },
      ],
    };


    // Update chart with relevant data
    instance.chart.update();
  });

  // Reactive update Chart Axis translation
  instance.autorun(() => {
    const scales = instance.chart.options.scales;

    // Update translation
    scales.xAxes[0].scaleLabel.labelString = TAPi18n.__('requestTimeline_xAxisTitle_days');
    scales.yAxes[0].scaleLabel.labelString = TAPi18n.__('requestTimeline_yAxisTitle_requests');

    // Update chart with new translation
    instance.chart.update();
  });
});

Template.requestTimeline.helpers({
  listPaths () {
    const timelineData = Template.currentData().timelineData;

    // Return all requested paths
    return timelineData.map(dataset => {
      return dataset.key;
    });
  },
});

Template.requestTimeline.events({
  'change #request-path-number': (event, templateInstance) => {
    // Get value of selected option
    const selectedPath = event.currentTarget.value;

    // Fetch related data for selected request_path
    templateInstance.changePath(selectedPath);
  },
});
