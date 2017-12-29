/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Chimp globals
/* globals browser */

class Page {
  get body () { return browser.element('body'); }

  open (path = '') {
    browser.windowHandleSize({
      width: 1280,
      height: 800,
    });

    browser.url(`http://localhost:3000/${path}`);

    this.body.waitForExist();
  }

  pause (miliseconds = 5000) {
    browser.pause(miliseconds);
  }

  $$ (selector) {
    const res = browser.elements(selector);
    return res.value;
  }
}
module.exports = Page;
