/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Npm packages imports
import moment from 'moment';

// APInf imports
import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';

Template.dashboardView.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.groupingIds = new ReactiveVar({
    myApis: [],
    managedApis: [],
    otherApis: [],
  });

  // Get API IDs for grouping
  Meteor.call('groupingApiIds', (err, res) => {
    instance.groupingIds.set(res);
  });

  // Init variables
  instance.overviewChartResponse = new ReactiveVar();
  instance.summaryStatisticResponse = new ReactiveVar();
  instance.comparisonStatisticResponse = new ReactiveVar();
  instance.statusCodesResponse = new ReactiveVar();

  instance.autorun(() => {
    const proxyId = FlowRouter.getQueryParam('proxy_id');
    const timeframe = FlowRouter.getQueryParam('timeframe');

    // Get timestamp of tomorrow 00:00:00 Date time (excluded value)
    const toDate = moment(0, 'HH').add(1, 'd').valueOf();

    // Get timestamp of timeframe ago 00:00:00 Date time (included value)
    const fromDate = moment(toDate).subtract(timeframe, 'd').valueOf();

    // Get data about summary statistic for current period
    promisifyCall('summaryStatisticNumber', { proxyId, fromDate, toDate })
      .then((currentPeriodDataset) => {
        instance.summaryStatisticResponse.set(currentPeriodDataset);

        const previousFromDate = moment(fromDate).subtract(timeframe, 'd').valueOf();

        // Get trend data is based on the current period data
        Meteor.call('summaryStatisticTrend',
          { proxyId, fromDate: previousFromDate, toDate: fromDate }, currentPeriodDataset,
          (err, compareResponse) => {
            // Save the response about Comparison data
            instance.comparisonStatisticResponse.set(compareResponse);
          });
      }).catch((error) => {
        throw new Meteor.Error(error);
      });

    Meteor.call('overviewChartsData', { proxyId, fromDate, toDate }, (error, dataset) => {
      instance.overviewChartResponse.set(dataset);
    });

    Meteor.call('statusCodesData', { proxyId, fromDate, toDate }, (error, dataset) => {
      instance.statusCodesResponse.set(dataset);
    });
  });
});

Template.dashboardView.helpers({
  grouping () {
    const instance = Template.instance();
    // Return object with IDs groups
    return instance.groupingIds.get();
  },
  overviewChartResponse () {
    const instance = Template.instance();

    return instance.overviewChartResponse.get();
  },
  summaryStatisticResponse () {
    const instance = Template.instance();

    return instance.summaryStatisticResponse.get();
  },
  comparisonStatisticResponse () {
    const instance = Template.instance();

    return instance.comparisonStatisticResponse.get();
  },
  statusCodesResponse () {
    const instance = Template.instance();

    return instance.statusCodesResponse.get();
  },
});
