/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import { $ } from 'meteor/jquery';
import withRenderedTemplate from '/apinf_packages/test/helper/test-helper.js';

if (Meteor.isClient) {
  import '/apinf_packages/core/client/layouts/master_layout/master_layout.js';

  describe('SignUp Page Rendering', () => {
    it('check render of SignUp page', () => {
      const templateData = {
        template: 'signUp',
      };
      withRenderedTemplate(templateData, (el) => {
        chai.assert.equal($(el).find('#at-field-username').length, 1);
      });
    });
  });
}


// import { Meteor } from 'meteor/meteor';
// import { Tracker } from 'meteor/tracker';
// import { DDP } from 'meteor/ddp-client';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { assert } from 'meteor/practicalmeteor:chai';
// import { Promise } from 'meteor/promise';
// import { $ } from 'meteor/jquery';

// import { denodeify } from '/apinf_packages/test/helper/denodeify';
// import { resetDatabase } from 'meteor/xolvio:cleaner';

// Utility -- returns a promise which resolves when all subscriptions are done
// const waitForSubscriptions = () => new Promise((resolve) => {
//   const poll = Meteor.setInterval(() => {
//     if (DDP._allSubscriptionsReady()) {
//       Meteor.clearInterval(poll);
//       resolve();
//     }
//   }, 200);
// });

// Tracker.afterFlush runs code when all consequent of a tracker based change
//   (such as a route change) have occured. This makes it a promise.
// const afterFlushPromise = denodeify(Tracker.afterFlush);

// if (Meteor.isClient) {
//   const testConnection = Meteor.connect(Meteor.absoluteUrl());

//   describe('Rendering: SignUp Page', () => {
//     // First, ensure the data that we expect is loaded on the server
//     //   Then, route the app to the homepage

//     it('renders the correct list when routed to', () => {
//       // FlowRouter.go('sign-up');
//       return afterFlushPromise()
//         .then(waitForSubscriptions)
//         .then(() => {
//           assert.equal($('#at-field-username').length, 1);
//         });
//     });
//   });
// }
