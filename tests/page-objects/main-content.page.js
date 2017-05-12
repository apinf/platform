/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* globals browser */

import Page from './page';

class MainContentPage extends Page {

  get signOutLink () { return browser.element('.sign-out'); }

  logOut () {
    this.signOutLink.waitForVisible(5000);
    this.signOutLink.click();
  }
}

module.exports = new MainContentPage();
