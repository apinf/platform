/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// Discover chimp-js browser
/* globals browser */

import signInPage from '../../page-objects/signin.page';

describe('00 login', () => {
  before(() => {
    signInPage.open();
  });

  describe('render', () => {
    it('should show email / username field', () => {
      signInPage.emailOrUsernameField.isVisible().should.be.true;
    });

    it('should show password field', () => {
      signInPage.passwordField.isVisible().should.be.true;
    });

    it('should show github button', () => {
      signInPage.githubButton.isVisible().should.be.true;
    });

    it('should show fiware button', () => {
      signInPage.fiwareButton.isVisible().should.be.true;
    });

    it('should show submit button', () => {
      signInPage.submitButton.isVisible().should.be.true;
    });

    it('should show register link', () => {
      signInPage.registerLink.isVisible().should.be.true;
    });

    it('should show forgot password link', () => {
      signInPage.forgotPasswordLink.isVisible().should.be.true;
    });

    it('should show forgot resend verification email link', () => {
      signInPage.resendVerificationEmailLink.isVisible().should.be.true;
    });

    it('should not show error alert', () => {
      signInPage.errorAlert.isVisible().should.be.false;
    });
  });

  describe('required fields', () => {
    before(() => {
      signInPage.submit();
    });

    describe('email / username and password', () => {
      it('should be required', () => {
        signInPage.errorAlert.isVisible().should.be.true;
      });
    });
  });
});
