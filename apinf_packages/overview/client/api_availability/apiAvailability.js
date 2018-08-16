/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.apiAvailabilityComponent.helpers({
  currentSubscriptionPlan () {
    // Current plan
    let planType;

    const subscriptionPlan = Meteor.user().subscriptionPlan;

    switch (subscriptionPlan) {
      case 'evaluation':
        planType = 'Evaluation';
        break;
      case 'starter':
        planType = 'Starter';
        break;
      case 'business':
        planType = 'Business';
        break;
      default:
        planType = 'Evaluation';
    }
    return planType;
  },
});
