/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Npm packages imports
import moment from 'moment';
import Chart from 'chart.js';

Template.responseTimeTimeline.onCreated(function () {
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

Template.responseTimeTimeline.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  const ctx = document.getElementById('response-time-timeline-chart').getContext('2d');
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
              labelString: 'Time, ms',
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

    // Points for line of the 95th percentiles of response time
    const percentiles95 = aggregationData.map((value) => {
      const responseTime = value.percentiles_response_time.values['95.0'];

      return {
        x: value.key,
        y: parseInt(responseTime, 10),
      };
    });

    // Points for line of the 60th percentiles of response time
    const percentiles50 = aggregationData.map((value) => {
      const responseTime = value.percentiles_response_time.values['50.0'];

      return {
        x: value.key,
        y: parseInt(responseTime, 10),
      };
    });

    // Create Labels values
    const labels = aggregationData.map(value => {
      return moment(value.key).format('MM/DD');
    });

    // Update labels & data
    instance.chart.data = {
      labels,
      datasets: [
        {
          label: 'The 95th percentiles',
          backgroundColor: '#959595',
          borderColor: '#959595',
          pointBorderColor: '#959595',
          fill: false,
          data: percentiles95,
        },
        {
          label: 'The 50th percentiles',
          backgroundColor: 'green',
          borderColor: 'green',
          pointBorderColor: 'green',
          fill: false,
          data: percentiles50,
        },
      ],
    };

    // Update chart with relevant data
    instance.chart.update();
  });
});

Template.responseTimeTimeline.helpers({
  listPaths () {
    const buckets = Template.instance().data.buckets;

    // Return all requested paths
    return buckets.map(bucket => {
      return bucket.key;
    });
  },
});

Template.responseTimeTimeline.events({
  'change #request-path-time': (event, templateInstance) => {
    // Get value of selected option
    const selectedPath = event.currentTarget.value;

    // Get Fetch data for selected request_path
    templateInstance.changePath(selectedPath);
  },
});
