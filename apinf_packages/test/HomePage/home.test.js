/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import { $ } from 'meteor/jquery';
import withRenderedTemplate from '/apinf_packages/test/helper/test-helper.js';

if (Meteor.isClient) {
  import '/apinf_packages/home/client/home.js';
  import '/apinf_packages/core/client/layouts/master_layout/master_layout.js';

  describe('Rendering: Home Page', function () {
    it('check render of HOME page', function () {
      const templateData = {
        template: 'home',
      };
      withRenderedTemplate(templateData, (el) => {
        chai.assert.equal($(el).find('#site-title').length, 1);
      });
    });
  });
}
