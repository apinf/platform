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
    type: 'line',
    // Data for displaying chart
    data: {
      labels: [],
      datasets: [],
    },
    // Configuration options

    options: {
      legend: {
        display: true,
        labels: {
          boxWidth: 20,
        },
      },
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
    // Get Date format
    const dateFormat = Template.currentData().dateFormat;

    // Get locale date format
    const localeDateFormat = getLocaleDateFormat(dateFormat);

    // Create labels value
    const labels = selectedPathData.dates.map(date => {
      return moment(date).format(localeDateFormat);
    });

    // Update labels & data
    instance.chart.data = {
      labels,
      datasets: [
        {
          label: TAPi18n.__('responseTimeTimeline_legendItem_shortest'),
          backgroundColor: '#00A421',
          borderColor: '#00A421',
          borderWidth: 1,
          data: selectedPathData.shortest,
          fill: false,
        },
        {
          label: TAPi18n.__('responseTimeTimeline_legendItem_short'),
          backgroundColor: '#A5D6A7',
          borderColor: '#A5D6A7',
          borderWidth: 1,
          data: selectedPathData.short,
          fill: false,
        },
        {
          label: TAPi18n.__('responseTimeTimeline_legendItem_median'),
          backgroundColor: '#04519b',
          borderColor: '#04519b',
          borderWidth: 1,
          data: selectedPathData.median,
          fill: false,
        },
        {
          label: TAPi18n.__('responseTimeTimeline_legendItem_long'),
          backgroundColor: '#C6C5C5',
          borderColor: '#C6C5C5',
          borderWidth: 1,
          data: selectedPathData.long,
          fill: false,
        },
        {
          label: TAPi18n.__('responseTimeTimeline_legendItem_longest'),
          backgroundColor: '#b94848',
          borderColor: '#b94848',
          borderWidth: 1,
          data: selectedPathData.longest,
          fill: false,
        },
      ],
    };

    instance.chart.options = {
      legend: {
        onHover (e) {
          e.target.style.cursor = 'pointer';
        },
      },
      hover: {
        onHover (e) {
          const point = this.getElementAtEvent(e);
          if (point.length) e.target.style.cursor = 'pointer';
          else e.target.style.cursor = 'default';
        },
      },
    };


    // Update chart with relevant data
    instance.chart.update();
  });

  // Reactive update Chart Axis translation
  instance.autorun(() => {
    let xAxesLabel;

    const datasets = instance.chart.data.datasets;
    const scales = instance.chart.options.scales;
    // Get Date format
    const dateFormat = Template.currentData().dateFormat;

    // If it is Day format
    if (dateFormat === 'L') {
      xAxesLabel = TAPi18n.__('responseTimeTimeline_xAxisTitle_days');
    } else {
      xAxesLabel = TAPi18n.__('responseTimeTimeline_xAxisTitle_hours');
    }

    // Update translation
    scales.xAxes[0].scaleLabel.labelString = xAxesLabel;
    scales.yAxes[0].scaleLabel.labelString = TAPi18n.__('responseTimeTimeline_yAxisTitle_time');
    datasets[0].label = TAPi18n.__('responseTimeTimeline_legendItem_shortest');
    datasets[1].label = TAPi18n.__('responseTimeTimeline_legendItem_short');
    datasets[2].label = TAPi18n.__('responseTimeTimeline_legendItem_median');
    datasets[3].label = TAPi18n.__('responseTimeTimeline_legendItem_long');
    datasets[4].label = TAPi18n.__('responseTimeTimeline_legendItem_longest');
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
