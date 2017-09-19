/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// Discover chimp-js browser
/* globals browser */

import signUpPage from '../../page-objects/signup.page';
import mainContent from '../../page-objects/main-content.page';
import loginPlatformsPage from '../../page-objects/login-platforms.page';

import {
  adminUsername,
  adminEmail,
  adminPassword,
} from '../../data/user';
import {
  githubClientId,
  githubClientSecret,
  fiwareClientId,
  fiwareClientSecret,
  rootURL,
 } from '../../data/settings';

describe('03 user creation', () => {
  before(() => {
    signUpPage.open();
  });

  it.skip('create admin user using github', () => {
    const adminCredentials = {
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
    };

    // Create Admin user
    signUpPage.registerNewUser(adminCredentials);

    // Setup settings
    signUpPage.gotModalToSetup();
    loginPlatformsPage.setupGithub({ githubClientId, githubClientSecret });
    loginPlatformsPage.setupFiware({ fiwareClientId, fiwareClientSecret, rootURL });

    mainContent.signOutLink.waitForExist(5000);
    mainContent.signOutLink.isVisible().should.be.true;
    mainContent.logOut();
  });
});
