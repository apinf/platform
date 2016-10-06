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
  const apiBackendId = Router.current().params._id;

  // Ensure current user has permissions to view backend
  Meteor.call('currentUserCanViewApi', apiBackendId, (error, userIsAllowedToViewApi) => {
    if (userIsAllowedToViewApi) {
      route.render('viewApi');
      route.layout('masterLayout');
    } else {
      Router.go('forbidden');
    }
  });
}, {
  name: 'viewApi',
});
