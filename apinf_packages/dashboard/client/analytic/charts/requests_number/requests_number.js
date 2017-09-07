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
    type: 'bar',
    // Data for displaying chart
    data: {
      labels: [],
      datasets: [],
    },
    // Configuration options
    options: {
      scales: {
        xAxes: [
          {
            maxBarThickness: 30,
            stacked: true,
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
            stacked: true,
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
    // Get ElasticSearch data
    const elasticsearchData = instance.elasticsearchData.get();

    // Get aggregated data for current chart
    const aggregationData = elasticsearchData.requests_over_time.buckets;

    const labels = [];
    const successCalls = [];
    const redirectCalls = [];
    const failCalls = [];
    const errorCalls = [];

    aggregationData.forEach(value => {
      // Create Labels values
      // TODO: internationalize date formatting
      labels.push(moment(value.key).format('MM/DD'));

      // Data for requests with success statuses
      successCalls.push(value.response_status.buckets.success.doc_count);

      // Data for requests with redirect statuses
      redirectCalls.push(value.response_status.buckets.redirect.doc_count);

      // Data for requests with fail statuses
      failCalls.push(value.response_status.buckets.fail.doc_count);

      // Data for requests with error statuses
      errorCalls.push(value.response_status.buckets.error.doc_count);
    });

    // Update labels & data
    instance.chart.data = {
      labels,
      datasets: [
        {
          label: '2XX',
          backgroundColor: '#468847',
          borderColor: '#468847',
          borderWidth: 1,
          data: successCalls,
        },
        {
          label: '3XX',
          backgroundColor: '#04519b',
          borderColor: '#04519b',
          borderWidth: 1,
          data: redirectCalls,
        },
        {
          label: '4XX',
          backgroundColor: '#e08600',
          borderColor: '#e08600',
          borderWidth: 1,
          data: failCalls,
        },
        {
          label: '5XX',
          backgroundColor: '#b94848',
          borderColor: '#b94848',
          borderWidth: 1,
          data: errorCalls,
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
    const timelineData = Template.instance().data.timelineData;

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
