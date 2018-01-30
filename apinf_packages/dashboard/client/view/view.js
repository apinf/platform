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

Template.dashboardView.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.groupingIds = new ReactiveVar({
    myApis: [],
    managedApis: [],
    otherApis: [],
  });

  instance.autorun(() => {
    const proxyId = FlowRouter.getQueryParam('proxy_id');
    if (proxyId) {
      // Get Proxy backend IDs for grouping
      Meteor.call('groupingBackendIds', proxyId, (err, res) => {
        instance.groupingIds.set(res);
      });
    }
  });

  // Init variables
  instance.overviewChartResponse = new ReactiveVar();
  instance.analyticsDataMyApis = new ReactiveVar();
  instance.analyticsDataManagedApis = new ReactiveVar();
  instance.analyticsDataOtherApis = new ReactiveVar();

  instance.autorun(() => {
    const proxyId = FlowRouter.getQueryParam('proxy_id');
    const timeframe = FlowRouter.getQueryParam('timeframe');

    // Get timestamp of tomorrow 00:00:00 Date time (excluded value)
    const toDate = moment(0, 'HH').add(1, 'd').valueOf();

    // Get timestamp of timeframe ago 00:00:00 Date time (included value)
    const fromDate = moment(toDate).subtract(timeframe, 'd').valueOf();

    Meteor.call('overviewChartsData', { proxyId, fromDate, toDate }, (error, dataset) => {
      instance.overviewChartResponse.set(dataset);
    });
  });

  instance.autorun(() => {
    const grouping = instance.groupingIds.get();
    const timeframe = FlowRouter.getQueryParam('timeframe');
    // Get timestamp of tomorrow 00:00:00 Date time (excluded value)
    const toDate = moment(0, 'HH').add(1, 'd').valueOf();

    // Get timestamp of timeframe ago 00:00:00 Date time (included value)
    const fromDate = moment(toDate).subtract(timeframe, 'd').valueOf();

    Meteor.call('totalNumberRequestsAndTrend',
      { fromDate, toDate, timeframe }, grouping.myApis, (error, result) => {
        this.analyticsDataMyApis.set(result);
      });

    Meteor.call('totalNumberRequestsAndTrend',
      { fromDate, toDate, timeframe }, grouping.managedApis, (error, result) => {
        this.analyticsDataManagedApis.set(result);
      });

    Meteor.call('totalNumberRequestsAndTrend',
      { fromDate, toDate, timeframe }, grouping.otherApis, (error, result) => {
        this.analyticsDataOtherApis.set(result);
      });
  });
});

Template.dashboardView.helpers({
  overviewChartResponse () {
    const instance = Template.instance();

    return instance.overviewChartResponse.get();
  },
  analyticsDataMyApis () {
    return Template.instance().analyticsDataMyApis.get();
  },
  analyticsDataManagedApis () {
    return Template.instance().analyticsDataManagedApis.get();
  },
  analyticsDataOtherApis () {
    return Template.instance().analyticsDataOtherApis.get();
  },
});
