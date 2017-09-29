/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Validates Promisify Meteor.call, for better response handling.
export default function promisifyCall (...args) {
  return new Promise((resolve, reject) => {
    Meteor.call(...args, (err, response) => {
      return err ? reject(err) : resolve(response);
    });
  });
}
