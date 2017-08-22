/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11
 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Npm packages imports
import moment from 'moment';
import Chart from 'chart.js';

Template.requestTimeline.onCreated(function () {
  const instance = this;
  const buckets = instance.data.buckets;

  instance.elasticsearchData = new ReactiveVar();

  // Chart depends on selected request path
  // Get related elasticsearch data when a user changed path
  instance.changePath = (path) => {
    // Find the related data for selected Path
    const relatedData = buckets.filter(value => {
      return value.key === path;
    });

    // Update value
    instance.elasticsearchData.set(relatedData[0]);
  };

  // On default get data for the first requested path
  instance.changePath(buckets[0].key);
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
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Days',
              fontSize: 14,
              fontColor: '#000000',
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: 'Requests, number',
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
    const allCalls = [];
    const successCalls = [];
    const redirectCalls = [];
    const failCalls = [];
    const errorCalls = [];

    aggregationData.forEach(value => {
      // Create Labels values
      labels.push(moment(value.key).format('MM/DD'));

      // Data for all requests
      allCalls.push({
        x: value.key,
        y: value.doc_count,
      });

      // Data for requests with success statuses
      successCalls.push({
        x: value.key,
        y: value.response_status.buckets.success.doc_count,
      });

      // Data for requests with redirect statuses
      redirectCalls.push({
        x: value.key,
        y: value.response_status.buckets.redirect.doc_count,
      });

      // Data for requests with fail statuses
      failCalls.push({
        x: value.key,
        y: value.response_status.buckets.fail.doc_count,
      });

      // Data for requests with error statuses
      errorCalls.push({
        x: value.key,
        y: value.response_status.buckets.error.doc_count,
      });
    });

    // Update labels & data
    instance.chart.data = {
      labels,
      datasets: [
        {
          label: 'All Calls',
          backgroundColor: '#959595',
          borderColor: '#959595',
          pointBorderColor: '#959595',
          data: allCalls,
          fill: false,
        },
        {
          label: '2XX',
          backgroundColor: '#468847',
          borderColor: '#468847',
          pointBorderColor: '#468847',
          data: successCalls,
          fill: false,
        },
        {
          label: '3XX',
          backgroundColor: '#04519b',
          borderColor: '#04519b',
          pointBorderColor: '#04519b',
          data: redirectCalls,
          fill: false,
        },
        {
          label: '4XX',
          backgroundColor: '#e08600',
          borderColor: '#e08600',
          pointBorderColor: '#e08600',
          data: failCalls,
          fill: false,
        },
        {
          label: '5XX',
          backgroundColor: '#b94848',
          borderColor: '#b94848',
          pointBorderColor: '#b94848',
          data: errorCalls,
          fill: false,
        },
      ],
    };

    // Update chart with relevant data
    instance.chart.update();
  });
});

Template.requestTimeline.helpers({
  listPaths () {
    const buckets = Template.instance().data.buckets;

    // Return all requested paths
    return buckets.map(bucket => {
      return bucket.key;
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
