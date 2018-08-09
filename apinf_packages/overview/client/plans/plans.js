/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.plans.helpers({
  evaluationPlan () {
    return Meteor.user().subscriptionPlan;
  },
});

Template.plans.events({
  'click .choose-subscriptionPlan': function () {
    // Get API from template data
    const userId = Meteor.user()._id;

    // Set the isPublic property to the opposite of its current value
    Meteor.users.update(userId, { $set: { subscriptionPlan: 'evaluation' } });
  },
});
