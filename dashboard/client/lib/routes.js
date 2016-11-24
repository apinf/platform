import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'dashboard' });
  },
});
