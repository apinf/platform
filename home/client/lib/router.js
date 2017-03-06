// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/', {
  name: 'home',
  action () {
    BlazeLayout.render('masterLayout', { main: 'home' });
  },
});
