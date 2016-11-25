import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Define group for routes that require sign in
const signedIn = FlowRouter.group({
  triggersEnter: [function () {
    if (!(Meteor.loggingIn() || Meteor.userId())) {
      // Redirect to sign in
      FlowRouter.go('signIn');
    }
  }]
});

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

const redirectToCatalogue = function () {
  FlowRouter.go('catalogue');
};

FlowRouter.triggers.enter([redirectToCatalogue], {only: ['forgotPwd']});

export { signedIn };
