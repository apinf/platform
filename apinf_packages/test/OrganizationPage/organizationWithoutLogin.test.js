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
  import '/apinf_packages/organizations/client/catalog/catalog.js';
  import '/apinf_packages/core/client/layouts/master_layout/master_layout.js';
  import '/apinf_packages/organizations/client/profile/profile.js';

  describe('Rendering: Organization Page without Login', () => {
    it('check render of ORGANIZATION page', () => {
      const templateData = {
        template: 'organizationCatalog',
      };
      withRenderedTemplate(templateData, (el) => {
        chai.assert.equal($(el).find('#organization-sort-select').length, 1);
      });
    });
  });

  describe('Rendering: Single Organization Page without Login', () => {
    it('check render of Single Organization page', () => {
      const templateData = {
        template: 'organizationProfile',
      };
      withRenderedTemplate(templateData, (elChild) => {
        chai.assert.equal($(elChild).find('.spinner-container').length, 1);
      });
    });
  });
}
