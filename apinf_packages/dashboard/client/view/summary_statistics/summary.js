/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import {
  arrowDirection,
  percentageValue,
} from '/apinf_packages/dashboard/lib/trend_helpers';
import localisedSorting from '/apinf_packages/core/helper_functions/string_utils';

// Collections imports
import Apis from '../../../../apis/collection';

Template.dashboardSummaryStatistic.onCreated(function () {
  // Dictionary of Flags about display/not the overview part for current item
  const instance = this;

  // Dictionary of Flags about display/not the overview part for current item
  instance.displayOverview = new ReactiveDict();
  instance.sortedAnalyticsData = new ReactiveVar();

  // Watching on Sort parameter
  instance.autorun(() => {
    let sortedAnalyticsData;
    const sortParameter = FlowRouter.getQueryParam('sort');

    const analyticsData = Template.currentData().analyticsData;

    if (analyticsData) {
      switch (sortParameter) {
        case 'calls': {
          // Sort by desc requests number
          sortedAnalyticsData = analyticsData.sort((a, b) => {
            return b.requestNumber - a.requestNumber;
          });
          break;
        }
        case 'users': {
          // Sort by desc unique users count
          sortedAnalyticsData = analyticsData.sort((a, b) => {
            return b.avgUniqueUsers - a.avgUniqueUsers;
          });
          break;
        }
        case 'time': {
          // Sort by desc median response time
          sortedAnalyticsData = analyticsData.sort((a, b) => {
            return b.medianResponseTime - a.medianResponseTime;
          });
          break;
        }
        default: {
          // sort by name on default
          sortedAnalyticsData = analyticsData.sort((a, b) => {
            return localisedSorting(a.apiName, b.apiName);
          });
        }
      }
    }

    // Update
    instance.sortedAnalyticsData.set(sortedAnalyticsData);
  });

  this.autorun(() => {
    const analyticsData = Template.currentData().analyticsData;
    const searchValue = Template.currentData().searchValue;

    // Make sure analyticsData exist and searchValue is provided
    if (searchValue && analyticsData) {
      // Get API IDs that satisfy provided search value
      const apiIds = Apis.find({
        name: {
          $regex: searchValue,
          $options: 'i', // case-insensitive option
        },
      }).map(api => { return api._id; });

      // Find in Analytics Dataset
      this.searchResult = analyticsData.filter(dataset => {
        return apiIds.indexOf(dataset.apiId) > -1;
      });
    }
  });
});

Template.dashboardSummaryStatistic.helpers({
  arrowDirection (parameter) {
    // Provide compared data
    return arrowDirection(parameter, this);
  },
  percentages (parameter) {
    // Provide compared data
    return percentageValue(parameter, this);
  },
  textColor (parameter) {
    let textColor;
    const direction = arrowDirection(parameter, this);

    // Green color for text -  percentage value near arrow
    if (direction === 'arrow-up' || direction === 'arrow-down_time') {
      textColor = 'text-success';
    }

    // Red color for text - percentage value near arrow
    if (direction === 'arrow-down' || direction === 'arrow-up_time') {
      textColor = 'text-danger';
    }

    return textColor;
  },
  displayOverview (parameter) {
    const instance = Template.instance();

    return instance.displayOverview.get(parameter);
  },
  tableTitle () {
    const title = Template.currentData().title;

    return TAPi18n.__(`dashboardSummaryStatistic_groupTitle_${title}`);
  },
  sortedAnalyticsData () {
    const searchValue = Template.currentData().searchValue;

    // Case: SearchName is specified
    if (searchValue) {
      // Display search result
      return Template.instance().searchResult;
    }
    // Otherwise: display all data
    return Template.instance().sortedAnalyticsData.get();
  },
  displayTable () {
    const searchValue = Template.currentData().searchValue;

    // Case: SearchName is specified
    if (searchValue) {
      // Get search data
      const searchResult = Template.instance().searchResult;
      // Display if table contains result
      return searchResult && searchResult.length > 0;
    }

    // Otherwise display table is analytics data is not empty
    const analyticsData = Template.currentData().analyticsData;

    return analyticsData && analyticsData.length > 0;
  },
  count () {
    const searchValue = Template.currentData().searchValue;

    // Case: SearchName is specified
    if (searchValue) {
      // Display search result
      return Template.instance().searchResult.length;
    }
    // Otherwise: display all data
    return Template.currentData().analyticsData.length;
  },
});

Template.dashboardSummaryStatistic.events({
  'click [data-id]': (event, templateInstance) => {
    const target = event.currentTarget;

    // Get status of specified Overview template (shown or not)
    const display = templateInstance.displayOverview.get(target.dataset.id);

    // Inverse the value
    templateInstance.displayOverview.set(target.dataset.id, !display);

    // Display or not the box-shadow for table line
    target.classList.toggle('open');
  },
});
