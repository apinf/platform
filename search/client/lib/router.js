// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/search', {
  name: 'search',
  action () {
    BlazeLayout.render('masterLayout', { main: 'search' });
  },
});
