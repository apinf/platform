import { Template } from 'meteor/templating';

Template.apiLifecycleStatus.helpers({
  lifecycleStatus () {
    // Get reference to template instahce
    const instance = Template.instance();

    let statusText;

    if (instance.api && instance.api.lifecycleStatus) {
      console.log(lifecycleStatus);
      statusText = instance.api.lifecycleStatus;
    } else {
      statusText = 'Unknown';
    }

    return statusText;
  },
});
