/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

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

Template.responseTimeTimeline.onCreated(function () {
  const instance = this;
  const placeholderData = { dates: [] };

  instance.selectedPathData = new ReactiveVar();

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

Template.responseTimeTimeline.onRendered(function () {
  // Get reference to template instance
  const instance = this;

  const ctx = document.getElementById('response-time-timeline-chart').getContext('2d');
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

  // Update chart when selectedPathData was changed
  instance.autorun(() => {
    // Get analytics data
    const selectedPathData = instance.selectedPathData.get();

    // Get locale date format
    const localeDateFormat = getLocaleDateFormat();

    // Create labels value
    const labels = selectedPathData.dates.map(date => {
      return moment(date).format(localeDateFormat);
    });

    // Update labels & data
    instance.chart.data = {
      labels,
      datasets: [
        {
          label: TAPi18n.__('responseTimeTimeline_legendItem_median'),
          backgroundColor: '#00A421',
          borderColor: 'green',
          borderWidth: 1,
          data: selectedPathData.median,
        },
        {
          label: TAPi18n.__('responseTimeTimeline_legendItem_95thPercentiles'),
          backgroundColor: '#C6C5C5',
          borderColor: '#959595',
          borderWidth: 1,
          data: selectedPathData.percentiles95,
        },
      ],
    };

    // Update chart with relevant data
    instance.chart.update();
  });

  // Reactive update Chart Axis translation
  instance.autorun(() => {
    const datasets = instance.chart.data.datasets;
    const scales = instance.chart.options.scales;

    // Update translation
    scales.xAxes[0].scaleLabel.labelString = TAPi18n.__('responseTimeTimeline_xAxisTitle_days');
    scales.yAxes[0].scaleLabel.labelString = TAPi18n.__('responseTimeTimeline_yAxisTitle_time');
    datasets[0].label = TAPi18n.__('responseTimeTimeline_legendItem_median');
    datasets[1].label = TAPi18n.__('responseTimeTimeline_legendItem_95thPercentiles');

    // Update chart with new translation
    instance.chart.update();
  });
});

Template.responseTimeTimeline.events({
  'change #request-path-time': (event, templateInstance) => {
    // Get value of selected option
    const selectedPath = event.currentTarget.value;

    // Get Fetch data for selected request_path
    templateInstance.changePath(selectedPath);
  },
});
