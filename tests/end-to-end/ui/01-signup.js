/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// Discover chimp-js browser
/* globals browser */

import signUpPage from '../../page-objects/signup.page';

describe('sign up', () => {
  before(() => {
    signUpPage.open();
  });

  describe('render', () => {
    it('should show username field', () => {
      signUpPage.usernameField.isVisible().should.be.true;
    });

    it('should show email field', () => {
      signUpPage.emailField.isVisible().should.be.true;
    });

    it('should show password field', () => {
      signUpPage.passwordField.isVisible().should.be.true;
    });

    it('should show confirm password field', () => {
      signUpPage.confirmPasswordField.isVisible().should.be.true;
    });

    it('should show github button', () => {
      signUpPage.githubButton.isVisible().should.be.true;
    });

    it('should show register button', () => {
      signUpPage.registerButton.isVisible().should.be.true;
    });
  });


//   describe('required fields', () => {
//     before(() => {
//       signUpPage.submit();
//     });

//     describe('email / username and password', () => {
//       it('should be required', () => {
//         signUpPage.errorAlert.isVisible().should.be.true;
//       });
//     });
//   });
});
