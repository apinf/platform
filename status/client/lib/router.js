import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/status', {
  name: 'statusCheck',
  action () {
    BlazeLayout.render('masterLayout', { main: 'statusCheck' });
  },
});
