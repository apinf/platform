import { Template } from 'meteor/templating';
import { Apis } from '/apis/collection/'

Template.apiLifecycleStatus.onCreated(function () {
  // Get reference to template instance
  const templateInstance = Template.instance();

  // Track edit mode with reactive variable (initially false)
  templateInstance.editMode = new ReactiveVar(false);
});

Template.apiLifecycleStatus.helpers({
  apisCollection () {
    // Return a reference to Apis collection
    return Apis;
  },
  editMode () {
    // Get reference to template instahce
    const templateInstance = Template.instance();

    // Return value of edit mode reactive variable
    return templateInstance.editMode.get();
  },
  lifecycleStatus () {
    // Get reference to template instahce
    const templateInstance = Template.instance();

    let statusText;

    if (templateInstance.data.api && templateInstance.data.api.lifecycleStatus) {
      statusText = templateInstance.data.api.lifecycleStatus;
    } else {
      statusText = 'Unknown';
    }

    return statusText;
  },
});

Template.apiLifecycleStatus.events({
  'click #edit-api-lifecycle-status': function (event, templateInstance) {
    // Enable edit mode
    templateInstance.editMode.set(true);
  },
  'click #save-api-lifecycle-status': function (event, templateInstance) {
    // Disable edit mode
    templateInstance.editMode.set(false);
  },
});
