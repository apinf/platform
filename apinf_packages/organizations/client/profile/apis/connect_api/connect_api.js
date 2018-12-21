/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import OrganizationApis from '/apinf_packages/organization_apis/collection';

Template.connectApiToOrganizationModal.onCreated(function () {
  const instance = this;
  instance.unlinkedApis = new ReactiveVar();

  // Get data about apis without organization
  Meteor.call('getCurrentUserUnlinkedApis', (error, apis) => {
    // Create array of unlinked API options for API select
    const unlinkedApiOptions = _.map(apis, (api) => {
      return {
        label: api.name,
        value: api._id,
      };
    });

    // Set reactive variable to contain unlinked API options
    instance.unlinkedApis.set(unlinkedApiOptions);
  });
});

Template.connectApiToOrganizationModal.helpers({
  organizationApisCollection () {
    // Return collection for autoform
    return OrganizationApis;
  },
  unlinkedApis () {
    const instance = Template.instance();
    // Get list of APIs without organization
    const unlinkedApisList = instance.unlinkedApis.get();
    // Initiate the title for dropdown
    const text = TAPi18n.__('connectApiToOrganizationModal_placeholderTitle');
    const selectionTitle = {
      label: text,
      value: '',
      disabled: true,
    };
    // Add title to list if not yet exists
    if (unlinkedApisList) {
      if (unlinkedApisList[0].label !== text) {
        unlinkedApisList.unshift(selectionTitle);
      }
    }
    return unlinkedApisList;
  },
});
