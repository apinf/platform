/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import signinPage from '../page-objects/signin.page';
import signupPage from '../page-objects/signup.page';
import mainContent from '../page-objects/main-content.page';


export default function loginAsOrCreateUser ({ username, email, password }) {
  let tries = 1;
  const max_tries = 3;
  let isLoggedIn = false;

  signinPage.open();
  
  while (tries <= max_tries && !isLoggedIn) {
    // If nobody is logged in
    if (mainContent.nobodyIsLoggedIn) {
      console.log(`[${tries}] User not logged.`);

      // First tries to login
      console.log(`[${tries}] Logging in.`);
      signinPage.login({ username, password });

      // If could not login
      if (mainContent.nobodyIsLoggedIn) {
        console.log(`[${tries}] Could not login. Creating user.`);
        // Creates the desired user
        signupPage.open();
        signupPage.registerNewUser({ username, email, password });

        console.log(`[${tries}] Logging in.`);
        signinPage.login({ username, password });
      }
    }

    // If user is logged in
    if (mainContent.isUserLoggedIn(username)) {
      console.log(`[${tries}] User already logged in. Leaving.`);
      isLoggedIn = true;
    // If someone else is logged in
    } else {
      console.log(`[${tries}] Someone else is logged in. Logging out.`);
      // Just logout now. It will retry to login.
      mainContent.logOut();
    }
    tries += 1;
  }
}
