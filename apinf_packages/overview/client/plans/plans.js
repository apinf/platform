/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.plans.helpers({
  evaluationPlan () {
    const subscriptionPlan = Meteor.user().subscriptionPlan;

    if (subscriptionPlan === 'evaluation') {
      return true;
    }
    return false;
  },
  starterPlan () {
    const subscriptionPlan = Meteor.user().subscriptionPlan;

    if (subscriptionPlan === 'starter') {
      return true;
    }
    return false;
  },
  businessPlan () {
    const subscriptionPlan = Meteor.user().subscriptionPlan;

    if (subscriptionPlan === 'business') {
      return true;
    }
    return false;
  },
  currentSubscriptionPlan () {
    return Meteor.user().subscriptionPlan;
  },
});

Template.plans.events({
  'click #apinf-plans_evaluation': function () {
    const userId = Meteor.user()._id;

    if (confirm('Are you sure you want to change to this plan?')) {
      Meteor.users.update(userId, { $set: { subscriptionPlan: 'evaluation' } });
    }
  },
  'click #apinf-plans_starter': function () {
    const userId = Meteor.user()._id;

    if (confirm('Are you sure you want to change to this plan?')) {
      Meteor.users.update(userId, { $set: { subscriptionPlan: 'starter' } });
    }
  },
  'click #apinf-plans_business': function () {
    const userId = Meteor.user()._id;

    if (confirm('Are you sure you want to change to this plan?')) {
      Meteor.users.update(userId, { $set: { subscriptionPlan: 'business' } });
    }
  },
});
