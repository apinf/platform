/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import OrganizationApis from '../../../collection';

Template.deleteOrganizationApiConfirmation.events({
  'click #delete-api-organization': function (event, templateInstance) {
    // Get Organization ID from template instance
    const organizationId = templateInstance.data.organizationApi.organizationId;

    // Get API ID from template instance
    const apiId = templateInstance.data.organizationApi.apiId;

    // Remove API from featured APIs list
    Meteor.call('removeApiFromFeaturedList', organizationId, apiId);

    // Get Organization API ID from template instance
    const organizationApiId = templateInstance.data.organizationApi._id;

    // Remove the Organization API link, by ID since code is untrusted
    OrganizationApis.remove(organizationApiId);

    // Dismiss the confirmation dialogue
    Modal.hide('deleteOrganizationApiConfirmation');

    // Get success message translation
    const message = TAPi18n.__('deleteOrganizationApiConfirmation_success_message');

    sAlert.success(message);
  },
});
