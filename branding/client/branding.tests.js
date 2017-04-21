/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

// Collection imports
import Branding from '/branding/collection';

// Meteor contributed packages imports
import { Factory } from 'meteor/dburles:factory';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { chai } from 'meteor/practicalmeteor:chai';

// APINF imports
import withRenderedTemplate from '/tests/utils/test-helpers.js';

FlowRouter.route('/', {
  name: 'hack route for tests',
  action () {},
});

describe('Branding', function () {
  // TODO: is there a way to register these two helpers automatically?
  beforeEach(function () {
    Template.registerHelper('_', key => { return key; });
  });
  afterEach(function () {
    Template.deregisterHelper('_');
  });

  describe('rendering when creating a new Branding', function () {
    it('should show expected fields', function () {
      // Instantiate a Branding model
      const branding = Factory.build('branding');
      const data = {
        // eslint-disable-next-line no-underscore-dangle
        branding: Branding._transform(branding),
      };
      withRenderedTemplate('branding', data, (el) => {
        chai.assert.equal($(el).find('.siteTitle').val(), branding.siteTitle);
      });
    });
  });

  describe('autoform', function () {
    // Instantiate brandingEdit autoform
    // Mock the call so that the data is not going to be inserted
    // Fill all fields
    // Hit the button
    // Check if sAlert was called
    it('makes sure mocha is working multiply', function () {
      chai.assert.equal(10 * 2, 20);
    });
  });
});
