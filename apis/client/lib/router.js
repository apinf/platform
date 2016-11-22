import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

Router.route('/api/new', function () {
  this.render('addApi');
  this.layout('masterLayout');
}, {
  name: 'addApi',
});

Router.route('/api/import', function () {
  this.render('importApiConfiguration');
  this.layout('masterLayout');
}, {
  name: 'importApiConfiguration',
});

Router.route('/api/:_id/', function () {
  // Save a reference to route, for use inside method callback function
  const route = this;

  // Get current API Backend ID
  const apiId = Router.current().params._id;

  // Check if API exists
  Meteor.call('checkIfApiExists', apiId, function (error, apiExists) {
    // Check if API exists
    if (apiExists) {
      // Ensure current user has permissions to view backend
      Meteor.call('currentUserCanViewApi', apiId, (error, userIsAllowedToViewApi) => {
        if (userIsAllowedToViewApi) {
          route.render('viewApi');
          route.layout('masterLayout');
        } else {
          // User is not allowed to view API
          Router.go('forbidden');
        }
      });
    } else {
      // If API doesn't exist, show 'Not Found'
      route.render('notFound');
    }
  });
}, {
  name: 'viewApi',
});
