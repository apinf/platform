/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// Discover chimp-js browser
/* globals browser */

import mainContent from '../../page-objects/main-content.page';

import loginAsOrCreateUser from '../../data/utils';
import { username, email, password } from '../../data/user';


describe('04 main page', () => {
  before(() => {
    loginAsOrCreateUser(username, email, password);
  });

  describe('render', () => {
    it('sign out link', () => {
      mainContent.signOutLink.isVisible().should.be.true;
    });

    it('has dropdown menu', () => {
      mainContent.dropdownMenu.isVisible().should.be.false;
      mainContent.clickOnDropdownToggle();
      mainContent.dropdownMenu.isVisible().should.be.true;
    });
  });
});
