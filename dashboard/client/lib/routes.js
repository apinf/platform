import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import signedIn from '/core/client/lib/router';

// Add route to signedIn group, requires user to sign in
signedIn.route('/dashboard', {
  // Get granularity parameter for Dashboard page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.granularity) {
      // Set query parameter if it doesn't exist
      context.queryParams.granularity = 'month';
    }
  }],
  name: 'dashboard',
  action () {
    BlazeLayout.render('masterLayout', { main: 'dashboard' });
  },
});
