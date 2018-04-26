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

// COllection imports
import Apis from '/apinf_packages/apis/collection';

// APInf import
import getDateRange from '/apinf_packages/core/helper_functions/date_range';

Template.dashboardView.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.groupingIds = new ReactiveVar();

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
    const grouping = instance.groupingIds.get();
    const timeframe = FlowRouter.getQueryParam('timeframe');
    const proxyId = FlowRouter.getQueryParam('proxy_id');

    if (grouping && timeframe && proxyId) {
      const queryOption = getDateRange(timeframe);

      const params = {
        proxyId,
        fromDate: queryOption.from,
        toDate: queryOption.to,
        interval: queryOption.interval,
        timeframe,
        onePeriodAgo: queryOption.onePeriodAgo,
        doublePeriodAgo: queryOption.doublePeriodAgo,
        responseCode: true,
      };

      const proxyBackendsIds = grouping.myApis.concat(
        grouping.managedApis, grouping.otherApis
      );

      // Get data for Overview charts
      Meteor.call('overviewChartsGeneral',
        params, proxyBackendsIds, (error, dataset) => {
          if (error) throw new Meteor.Error(error.message);

          instance.overviewChartResponse.set(dataset);
        });

      Meteor.call('totalNumberAndTrendGeneral',
        params, grouping.myApis, (error, result) => {
          console.log(error);
          this.analyticsDataMyApis.set(result);
        });

      Meteor.call('totalNumberAndTrendGeneral',
        params, grouping.managedApis, (error, result) => {
          this.analyticsDataManagedApis.set(result);
        });

      Meteor.call('totalNumberAndTrendGeneral',
        params, grouping.otherApis, (error, result) => {
          this.analyticsDataOtherApis.set(result);
        });
    }
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
  displayTables () {
    const searchValue = Template.currentData().searchValue;

    // Make sure searchValue exists
    if (searchValue) {
      const query = { name: { $regex: searchValue, $options: 'i' } };

      // Display tables if result is not empty
      return Apis.find(query).count() !== 0;
    }

    // Display tables by default
    return true;
  },
});
