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
  import '/apinf_packages/api_catalog/client/api_catalog.js';
  import '/apinf_packages/core/client/layouts/master_layout/master_layout.js';
  import '/apinf_packages/apis/client/profile/view.js';

  describe('Rendering: Apis Page without Login', () => {
    it('check render of APIS page', () => {
      const templateData = {
        template: 'apiCatalog',
      };
      withRenderedTemplate(templateData, (el) => {
        chai.assert.equal($(el).find('#catalog-toolbar').length, 1);
      });
    });
  });
  describe('Rendering: Single Api Page without Login', () => {
    it('check render of Single API page', () => {
      const templateData = {
        template: 'viewApi',
      };
      withRenderedTemplate(templateData, (elChild) => {
        chai.assert.equal($(elChild).find('.spinner-container').length, 1);
      });
    });
  });
}
