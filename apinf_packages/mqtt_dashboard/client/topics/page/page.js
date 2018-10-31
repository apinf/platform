/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collections imports
import StoredTopics from '../../../collection';

// APInf imports
import ESData from './search_helpers';

Template.topicsPage.onCreated(function () {
  this.subscribe('allTopics');

  this.newTopic = new ReactiveVar();
});

Template.topicsPage.onRendered(() => {
  // Settings to Select field
  $('#search-topic-select').select2({
    placeholder: 'Search',
    allowClear: true,
    dataAdapter: ESData,
  });
});

Template.topicsPage.helpers({
  newTopic () {
    return Template.instance().newTopic.get();
  },
});

Template.topicsPage.events({
  'select2:select': (event, templateInstance) => {
    // Remove the around spaces & remove the last Hash symbol
    const value = event.params.data.text.trim();
    const topic = value.replace('#', '');

    // Make sure a topic value isn't added before
    const existTopic = StoredTopics.findOne({ value: topic });

    if (existTopic) {
      sAlert.error('Current topic already exists');
    } else {
      // Insert into MongoDB a new topic
      const id = StoredTopics.insert({
        value: topic,
        starred: false,
        createdBy: Meteor.userId(),
        createdAt: new Date(),
      });

      templateInstance.newTopic.set({ value: topic, id });
    }
  },
});
