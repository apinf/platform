// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/documentation/editor', {
  name: 'apiDocumentationEditor',
  action () {
    BlazeLayout.render('masterLayout', { main: 'apiDocumentationEditor' });
  },
});
