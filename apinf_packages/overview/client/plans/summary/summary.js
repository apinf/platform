/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.overviewPlan.helpers({
  currentSubscriptionPlan () {
    // Current plan
    let planType;

    const subscriptionPlan = Meteor.user().subscriptionPlan;

    switch (subscriptionPlan) {
      case 'evaluation':
        planType = 'Evaluation plan';
        break;
      case 'starter':
        planType = 'Starter plan';
        break;
      case 'business':
        planType = 'Business plan';
        break;
      default:
        planType = 'Evaluation plan';
    }
    return planType;
  },
});
