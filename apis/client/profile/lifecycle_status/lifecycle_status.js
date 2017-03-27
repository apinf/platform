/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

Template.apiLifecycleStatus.helpers({
  labelType () {
    // Get reference to template instance
    const templateInstance = Template.instance();

    // Placeholder for label type
    let labelType;

    // Get API lifecycle status from template instance
    const lifecycleStatus = templateInstance.data.api.lifecycleStatus;

    // Get label type based on lifecycle status
    switch (lifecycleStatus) {
      case 'development':
        labelType = 'primary';
        break;
      case 'production':
        labelType = 'success';
        break;
      case 'design':
        labelType = 'info';
        break;
      case 'testing':
        labelType = 'warning';
        break;
      case 'deprecated':
        labelType = 'danger';
        break;
      default:
        labelType = 'default';
    }
    return labelType;
  },
  lifecycleStatus () {
    // Get reference to template instance
    const templateInstance = Template.instance();

    // Get lifecycle status from API document
    const status = templateInstance.data.api.lifecycleStatus;

    // Get status text translation
    return TAPi18n.__(`apiLifecycleStatus_labelText_${status}`);
  },
});
