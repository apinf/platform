/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// Meteor imports
import { Template } from 'meteor/templating';
// import { $ } from 'meteor/jquery';

// Meteor contributed packages imports
import { chai } from 'meteor/practicalmeteor:chai';

// APINF imports
// import withRenderedTemplate from '/tests/utils/test-helpers.js';

describe('Branding', function () {
  // TODO: is there a way to register these two helpers automatically?
  beforeEach(function () {
    Template.registerHelper('_', key => { return key; });
  });
  afterEach(function () {
    Template.deregisterHelper('_');
  });

  it('makes sure mocha is working', function () {
    chai.assert.equal(1 + 2, 2);
  });

  describe('main template', function () {
    // Instantiate a Branding template
    // checks if all fields are there
  });

  describe('autoform', function () {
    // Instantiate brandingEdit autoform
    // Mock the call so that the data is not going to be inserted
    // Fill all fields
    // Hit the button
    // Check if sAlert was called
  });
});
