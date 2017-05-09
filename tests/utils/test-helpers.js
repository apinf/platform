/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

 // Meteor packages imports
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

// Npm packages imports
import _ from 'lodash';

// Helper function to dynamically create a div
function withDiv (callback) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  try {
    callback(el);
  } finally {
    document.body.removeChild(el);
  }
}

// Render a template in Blaze for testing purposes
export default function withRenderedTemplate (template, data, callback) {
  withDiv((el) => {
    const ourTemplate = _.isString(template) ? Template[template] : template;
    console.log(ourTemplate);
    Blaze.renderWithData(ourTemplate, data, el);
    Tracker.flush();
    callback(el);
  });
}
