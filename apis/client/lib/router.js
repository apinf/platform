import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/api/new', {
  name: 'addApi',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'addApi' });
  },
});

FlowRouter.route('/api/import', {
  name: 'importApiConfiguration',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'importApiConfiguration' });
  },
});

FlowRouter.route('/api/:_id/', {
  name: 'viewApi',
  action: function (params) {
    // Get current API Backend ID
    const apiId = params._id;

    // Check if API exists
    Meteor.call('checkIfApiExists', apiId, function (error, apiExists) {
      // Check if API exists
      if (apiExists) {
        // Ensure current user has permissions to view backend
        Meteor.call('currentUserCanViewApi', apiId, (error, userIsAllowedToViewApi) => {
          if (userIsAllowedToViewApi) {
            FlowRouter.go('viewApi', { _id: apiId });
            BlazeLayout.render('masterLayout', { main: 'viewApi' });
          } else {
            // User is not allowed to view API
            FlowRouter.go('forbidden');
          }
        });
      } else {
        // If API doesn't exist, show 'Not Found'
        FlowRouter.go('notFound');
      }
    });
  },
});
