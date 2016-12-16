import { Template } from 'meteor/templating';

Template.apiLifecycleStatus.helpers({
  lifecycleStatus () {
    // Get reference to template instahce
    const templateInstance = Template.instance();

    let statusText;

    if (templateInstance.api && templateInstance.api.lifecycleStatus) {
      statusText = templateInstance.api.lifecycleStatus;
    } else {
      statusText = 'Unknown';
    }

    return statusText;
  },
});

Template.apiLifecycleStatus.events({
  'click #edit-api-lifecycle-status' (event, templateInstance) {
    console.log(templateInstance);
  }
});
