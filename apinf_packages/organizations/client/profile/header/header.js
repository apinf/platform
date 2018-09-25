/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Branding from '/apinf_packages/branding/collection';
import OrganizationLogo from '/apinf_packages/organizations/logo/collection/collection';

Template.organizationProfileHeader.onCreated(function () {
  const instance = this;

  instance.autorun(() => {
    // Get organization data using reactive way
    const organization = Template.currentData().organization;

    if (organization) {
      if (organization.organizationCoverFileId) {
        // Subscribe to Organization cover
        instance.subscribe('organizationCoverById', organization.organizationCoverFileId);
      }
      // Get organization data using reactive way
      if (organization && organization.organizationLogoFileId) {
        // Subscribe to current Organization logo
        instance.subscribe('currentOrganizationLogo', organization.organizationLogoFileId);
      }
      const branding = Branding.findOne();
      // Check if Branding collection and siteTitle are available
      if (branding && branding.siteTitle) {
        // Set the page title
        DocHead.setTitle(`${branding.siteTitle} - ${organization.name}`);
      }
    }
  });
});

Template.organizationProfileHeader.onRendered(function () {
  // Get current url hash value
  const hashTabValue = location.hash.substr(1);

  // If url contain hash value
  if (hashTabValue) {
    // Show tab
    $(`.secondary-menu_navigation a[href='#${hashTabValue}']`).tab('show');
  }
  // Mobile menu
  $(() => {
    // var $nav = $('nav.secondary-menu_navigation');
    const $btn = $('nav.secondary-menu_navigation button');
    const $vlinks = $('nav.secondary-menu_navigation .links');
    const $hlinks = $('nav.secondary-menu_navigation .hidden-links');

    let numOfItems = 0;
    let totalSpace = 0;
    const breakWidths = [];

    let availableSpace;
    let numOfVisibleItems;
    let requiredSpace;

    // Get initial state
    $vlinks.children().outerWidth((i, w) => {
      totalSpace += w;
      numOfItems += 1;
      breakWidths.push(totalSpace);
    });
    function check () {
      // Get instant state
      availableSpace = $vlinks.width() - 10;
      numOfVisibleItems = $vlinks.children().length;
      requiredSpace = breakWidths[numOfVisibleItems - 1];

      // There is not enought space
      if (requiredSpace > availableSpace) {
        $vlinks.children().last().prependTo($hlinks);
        numOfVisibleItems -= 1;
        check();
        // There is more than enough space
      } else if (availableSpace > breakWidths[numOfVisibleItems]) {
        $hlinks.children().first().appendTo($vlinks);
        numOfVisibleItems += 1;
      }
      // Update the button accordingly
      $btn.attr('count', numOfItems - numOfVisibleItems);
      if (numOfVisibleItems === numOfItems) {
        $btn.addClass('hidden');
      } else $btn.removeClass('hidden');
    }

    // Window listeners
    $(window).resize(() => {
      check();
    });

    $btn.on('click', () => {
      $hlinks.toggleClass('hidden');
    });

    check();
  });

  // Assign resumable browse to element
  OrganizationLogo.resumable.assignBrowse(this.$('#organization-file-browse'));
});

Template.organizationProfileHeader.events({
  'click #edit-organization': function (event, templateInstance) {
    // Get organization from template instance
    const organization = templateInstance.data.organization;

    // Show organization form modal
    Modal.show('organizationForm', { organization, formType: 'update' });
  },
  'click .secondary-menu_navigation li > a': (event) => {
    // Show hash value in url
    window.location = `${event.currentTarget.hash}`;
  },
  'click [data-lifecycle]': (event) => {
    // Get value of data-lifecycle
    const selectedTag = event.currentTarget.dataset.lifecycle;
    // Set value in query parameter
    FlowRouter.setQueryParams({ lifecycle: selectedTag });
  },
});
