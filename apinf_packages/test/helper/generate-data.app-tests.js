/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// import { Factory } from 'meteor/dburles:factory';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
// import { Random } from 'meteor/random';
// import { _ } from 'meteor/underscore';

// import { denodeify } from '../utils/denodeify';

// const createList = (userId) => {
//   const list = Factory.create('list', { userId });
//   _.times(3, () => Factory.create('todo', { listId: list._id }));
//   return list;
// };

// Meteor.methods({
//   generateFixtures() {
//     resetDatabase();

//     // create 3 public lists
//     _.times(3, () => createList());

//     // create 3 private lists
//     _.times(3, () => createList(Random.id()));
//   },
// });

// if (Meteor.isClient) {
//   // Create a second connection to the server to use to call test data methods
//   // We do this so there's no contention w/ the currently tested user's connection
//   const testConnection = Meteor.connect(Meteor.absoluteUrl());

//   const generateData = denodeify((cb) => {
//     testConnection.call('generateFixtures', cb);
//   });

//   export { generateData };
// }
