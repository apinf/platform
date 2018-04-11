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

// APInf imports
import { getLocaleDateFormat } from '/apinf_packages/core/helper_functions/format_date';

Template.requestTimeline.onCreated(function () {
  const instance = this;

  instance.selectedPathData = new ReactiveVar();
  const placeholderData = { dates: [] };

  // Chart area depends on selected request path
  // Get related analytics data when a user changed path
  instance.changePath = (path) => {
    // Find the analytics data for selected Path
    const selectedPathData = Template.currentData().chartData[path] || placeholderData;

    // Update value
    instance.selectedPathData.set(selectedPathData);
  };

  instance.autorun(() => {
    const listPaths = Template.currentData().listPaths;

    // On default get data for the first requested path
    instance.changePath(listPaths[0]);
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
              labelString: TAPi18n.__('requestTimeline_xAxisTitle_times'),
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
    // Get analytics data
    const selectedPathData = instance.selectedPathData.get();
    // Get Date format
    const dateFormat = Template.currentData().dateFormat;

    // Get locale date format
    const localeDateFormat = getLocaleDateFormat(dateFormat);

    // Initialization
    const labels = selectedPathData.dates.map(date => {
      return moment(date).format(localeDateFormat);
    });

    // Update labels & data
    instance.chart.data = {
      labels,
      datasets: [
        {
          label: '2XX',
          backgroundColor: '#468847',
          borderColor: '#468847',
          data: selectedPathData.success,
          fill: false,
        },
        {
          label: '3XX',
          backgroundColor: '#04519b',
          borderColor: '#04519b',
          data: selectedPathData.redirect,
          fill: false,
        },
        {
          label: '4XX',
          backgroundColor: '#e08600',
          borderColor: '#e08600',
          data: selectedPathData.fail,
          fill: false,
        },
        {
          label: '5XX',
          backgroundColor: '#b94848',
          borderColor: '#b94848',
          data: selectedPathData.error,
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

Template.requestTimeline.events({
  'change #request-path-number': (event, templateInstance) => {
    // Get value of selected option
    const selectedPath = event.currentTarget.value;

    // Fetch related data for selected request_path
    templateInstance.changePath(selectedPath);
  },
});
