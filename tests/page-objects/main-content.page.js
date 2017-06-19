/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* globals browser */

import Page from './page';

class MainContentPage extends Page {

  get dropdownToggle () { return browser.element('.dropdown-toggle'); }
  get dropdownMenu () { return browser.element('.dropdown'); }
  get signOutLink () { return browser.element('.sign-out'); }
  get username () { return browser.element('.username'); }

  get someoneIsLoggedIn () {
    return this.dropdownMenu.isVisible();
  }

  get nobodyIsLoggedIn () {
    return !this.someoneIsLoggedIn;
  }

  isUserLoggedIn (username) {
    let loggedIn = false;
    if (this.someoneIsLoggedIn) {
      loggedIn = this.username.getText() === username;
    }
    return loggedIn;
  }

  clickOnDropdownToggle () {
    this.dropdownToggle.waitForVisible(5000);
    this.dropdownToggle.click();
  }

  logOut () {
    this.signOutLink.waitForVisible(5000);
    this.signOutLink.click();
  }
}

module.exports = new MainContentPage();
