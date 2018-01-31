/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */


// import { Meteor } from 'meteor/meteor';
// import { Tracker } from 'meteor/tracker';
// import { DDP } from 'meteor/ddp-client';
// import { FlowRouter } from 'meteor/kadira:flow-router';
// import { assert } from 'meteor/practicalmeteor:chai';
// import { Promise } from 'meteor/promise';
// import { $ } from 'meteor/jquery';

// import Apis '/apinf_packages/apis/collection';

// // import { denodeify } from '../../utils/denodeify';
// // import { generateData } from './../../api/generate-data.app-tests.js';
// // import { Lists } from '../../api/lists/lists.js';
// // import { Todos } from '../../api/todos/todos.js';

// // Utility -- returns a promise which resolves when all subscriptions are done
// const waitForSubscriptions = () => new Promise(resolve => {
//   const poll = Meteor.setInterval(() => {
//     if (DDP._allSubscriptionsReady()) {
//       Meteor.clearInterval(poll);
//       resolve();
//     }
//   }, 200);
// });
// // Tracker.afterFlush runs code when all consequent of a tracker based change
// //   (such as a route change) have occured. This makes it a promise.
// // const afterFlushPromise = denodeify(Tracker.afterFlush);
// if (Meteor.isClient) {
//   describe('data available when routed', () => {
//     // First, ensure the data that we expect is loaded on the server
//     //   Then, route the app to the homepage
//     beforeEach(() => FlowRouter.go('/apis')
//       .then(waitForSubscriptions)
//     );
//     describe('when logged out', () => {
//       it('has all public lists at homepage', () => {
//       	console.log(':--> ',Apis.find().count())
//         assert.equal(Apis.find().count());
//       });


//       /*it('renders the correct list when routed to', () => {
//         const list = Lists.findOne();
//         FlowRouter.go('Lists.show', { _id: list._id });
//         return afterFlushPromise()
//           .then(waitForSubscriptions)
//           .then(() => {
//             assert.equal($('.title-wrapper').html(), list.name);
//             assert.equal(Todos.find({ listId: list._id }).count(), 3);
//           });
//       });*/
//     });
//   });
// }
