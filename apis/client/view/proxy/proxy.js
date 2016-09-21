import { Template } from 'meteor/templating';

Template.apiProxy.events({
  'click #delete-proxy-backend': () => {
    console.log('deleting');
  },
});
