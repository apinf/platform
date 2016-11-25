import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { signedIn } from '/core/client/lib/router';

// Add route to signedIn group, requires user to sign in
signedIn.route('/dashboard', {
  name: 'dashboard',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'dashboard' });
  },
});
