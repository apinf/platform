import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/not-authorized', {
  name: 'notAuthorized',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'notAuthorized' });
  },
});

FlowRouter.route('/forbidden', {
  name: 'forbidden',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'forbidden' });
  },
});

const redirectToDashboard = function () {
  if (Meteor.user()) {
    FlowRouter.go('/dashboard');
  }
};

FlowRouter.triggers.enter([redirectToDashboard], {only: ['forgotPwd', 'signOut']});

/*
// Routes for logged in user
Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});
*/
