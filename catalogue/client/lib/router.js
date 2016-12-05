import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/catalogue', {
  name: 'catalogue',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'catalogue' });
  },
});
