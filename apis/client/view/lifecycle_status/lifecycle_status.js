import { Template } from 'meteor/templating';

Template.apiLifecycleStatus.helpers({
  lifecycleStatus () {
    return 'Unknown';
  },
});
