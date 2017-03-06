// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// APINF imports
import signedIn from '/core/client/lib/router';

// Add route to signedIn group, requires user to sign in
signedIn.route('/dashboard', {
  // Get granularity parameter for Dashboard page on Enter
  triggersEnter: [function (context) {
    if (!context.queryParams.granularity) {
      // Set query parameter if it doesn't exist
      context.queryParams.granularity = 'month';
    }

    // Initialize the query parameters which can be conculated in code
    // Do it to saving url consistent for the browser history
    if (!context.queryParams.backend) {
      // Initialize backend parameter if it doesn't specify
      context.queryParams.backend = null;
    }
    if (!context.queryParams.fromDate) {
      // Initialize fromDate parameter if it doesn't specify
      context.queryParams.fromDate = null;
    }
    if (!context.queryParams.toDate) {
      // Initialize toDate parameter if it doesn't specify
      context.queryParams.toDate = null;
    }
  }],
  name: 'dashboard',
  action () {
    BlazeLayout.render('masterLayout', { main: 'dashboard' });
  },
});
