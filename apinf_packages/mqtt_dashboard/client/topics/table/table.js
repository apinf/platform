/* Copyright 2017 Apinf Oy
  instance file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// NPM imports
import _ from 'lodash';

// Collections imports
import StoredTopics from '../../../collection/index';

// APInf imports
import { getDateRange } from '../../../lib/helpers';
import { arrowDirection, percentageValue } from '../../../../dashboard/lib/trend_helpers';

Template.displayTopicsTable.onCreated(function () {
  const instance = this;
  // Variables initialization
  instance.error = new ReactiveVar();
  instance.dataIsReady = new ReactiveVar(true);
  instance.remainingTrafficReady = new ReactiveVar(true);

  instance.trend = new ReactiveVar({});
  instance.topicsData = new ReactiveVar();
  instance.remainingTraffic = new ReactiveVar();

  instance.timeframe = '24';

  // Update data for Stored Topics
  instance.getTopicsData = () => {
    instance.error.set();
    instance.trend.set({});

    // Mark data is fetching
    instance.dataIsReady.set(false);

    // Build the current Topics list
    const topics = _.map(instance.staticTopicsData, (topicItem) => {
      return topicItem.value;
    });

    Meteor.call('fetchTopicsTableData',
      topics, instance.timeframe, instance.dateRange, (error, response) => {
        // Mark is Ready
        instance.dataIsReady.set(true);

        if (error) {
          // Display error message
          instance.error.set(error.message);
          throw new Meteor.Error(error.message);
        }

        // Store the table data
        instance.topicsData.set(response.topicsData);

        // Store the comparison data
        const trend = instance.trend.get();
        // Extend the current Object
        instance.trend.set(Object.assign(trend, response.trend));
      });
  };

  // Update data for Remaining traffic
  instance.updateRemainingTraffic = () => {
    instance.remainingTrafficReady.set(false);
    instance.remainingTraffic.set({
      value: 'remaining',
      incomingBandwidth: 0,
      outgoingBandwidth: 0,
      publishedMessages: 0,
      deliveredMessages: 0,
      subscribedClients: 0,
      publishedClients: 0,
    });

    // Build the current Topics list
    const topics = _.map(instance.staticTopicsData, (topicItem) => {
      return topicItem.value;
    });

    // Process data
    Meteor.call('fetchRemainingTrafficData', topics, instance.timeframe, instance.dateRange, (error, result) => {
      // Mark is ready
      instance.remainingTrafficReady.set(true);

      if (error) {
        sAlert.error(error.message);
        throw new Meteor.Error(error.message);
      }

      // Store the table data
      instance.remainingTraffic.set(result.trafficData);
      // Get the comparison data
      const trend = instance.trend.get();
      // Extend the global variable
      trend[result.trafficData.value] = result.trend;
      instance.trend.set(trend);
    });
  };

  instance.getAllDataForTable = () => {
    // Get timestamp of date range
    instance.dateRange = getDateRange(instance.timeframe);

    // Send request only if Topics list exists
    if (instance.staticTopicsData.length > 0) {
      // Fetch data when timeframe is changed
      instance.getTopicsData();
    }

    // Get data about Remaining topic only if it is not Main page
    if (!instance.data.mainPage) {
      // Update dataset for Remaining traffic
      instance.updateRemainingTraffic();
    }
  };

  instance.updateTopicsData = (newTopic) => {
    if (newTopic) {
      // Extend the current list on a new topic
      instance.staticTopicsData.push({
        _id: newTopic.id,
        value: newTopic.value,
        incomingBandwidth: 0,
        outgoingBandwidth: 0,
        publishedMessages: 0,
        deliveredMessages: 0,
        subscribedClients: 0,
        publishedClients: 0,
      });
    } else {
      // Build list is based on the current list
      instance.staticTopicsData = StoredTopics.find().map(topicItem => {
        return {
          _id: topicItem._id,
          value: topicItem.value,
          incomingBandwidth: 0,
          outgoingBandwidth: 0,
          publishedMessages: 0,
          deliveredMessages: 0,
          subscribedClients: 0,
          publishedClients: 0,
        };
      });
    }

    // Update reactivaly store for Topics Data
    instance.topicsData.set(instance.staticTopicsData);

    // Fetching data
    instance.getAllDataForTable();
  };

  // Reactively watching on a new Topic
  instance.autorun(() => {
    const newTopic = Template.currentData().newTopic;

    if (newTopic) {
      // Fetching data with a new Topic value
      instance.updateTopicsData(newTopic);
    }
  });

  // Fetching data
  instance.updateTopicsData();
});

Template.displayTopicsTable.helpers({
  starIcon () {
    const topicItem = StoredTopics.findOne(this._id);
    const starred = topicItem && topicItem.starred;

    return starred ? 'fa-star' : 'fa-star-o';
  },
  arrowDirection (param) {
    const trend = Template.instance().trend.get();

    return arrowDirection(param, trend[this.value]);
  },
  percentageValue (param) {
    const trend = Template.instance().trend.get();

    return percentageValue(param, trend[this.value]);
  },
  textColor (param) {
    const trend = Template.instance().trend.get();

    const direction = arrowDirection(param, trend[this.value]);

    return direction === 'arrow-up' ? 'text-green' : 'text-red';
  },
  trend () {
    const trend = Template.instance().trend.get();

    return !!(trend[this.value]);
  },
  topicsData () {
    return Template.instance().topicsData.get();
  },
  dataIsReady () {
    return Template.instance().dataIsReady.get();
  },
  remainingTraffic () {
    return Template.instance().remainingTraffic.get();
  },
  remainingTrafficReady () {
    return Template.instance().remainingTrafficReady.get();
  },
  error () {
    return Template.instance().error.get();
  },
  noStarredTopic () {
    // Main page is, no Starred stored topics are
    const mainPage = Template.instance().data.mainPage;
    const noStarredTopic = StoredTopics.find({ starred: true }).count() === 0;

    return mainPage && noStarredTopic;
  },
  localeString (number) {
    return number.toLocaleString();
  },
});

Template.displayTopicsTable.events({
  'click .starred': (event, templateInstance) => {
    const mainPage = Template.instance().data.mainPage;

    const topicId = event.currentTarget.dataset.id;

    const topicItem = StoredTopics.findOne(topicId);

    // Invert "starred" status
    StoredTopics.update({ _id: topicId }, { $set: { starred: !topicItem.starred } });

    if (mainPage) {
      // Update the Topics list on the Main page
      templateInstance.staticTopicsData =
        _.filter(templateInstance.staticTopicsData, (dataset) => {
          // Not display unstarred topics
          return dataset._id !== topicId;
        });
      // Update reactivaly store
      templateInstance.topicsData.set(templateInstance.staticTopicsData);
    }
  },
  'change #date-range-picker': (event, templateInstance) => {
    // Get Timeframe value
    templateInstance.timeframe = event.currentTarget.value;

    // Update data in the Table
    templateInstance.updateTopicsData();
  },
  'click .remove-topic': (event, templateInstance) => {
    // Remove from MongoDB
    StoredTopics.remove(event.currentTarget.dataset.id);

    // Update data in the Table
    templateInstance.updateTopicsData();
  },
  'click #reload-table': (event, templateInstance) => {
    // Update data in the Table because the button was clicked
    templateInstance.updateTopicsData();
  },
});
