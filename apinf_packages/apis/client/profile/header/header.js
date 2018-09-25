/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Apis from '/apinf_packages/apis/collection';

Template.viewApiPageHeader.onRendered(() => {
  // Get current url hash value
  const hashTabValue = location.hash.substr(1);

  // If url contain hash value
  if (hashTabValue) {
    // Show tab
    $(`.links a[href='#${hashTabValue}']`).tab('show');
  }

  // Mobile menu
  $(function () {
    //var $nav = $('nav.secondary-menu_navigation');
    var $btn = $('nav.secondary-menu_navigation button');
    var $vlinks = $('nav.secondary-menu_navigation .links');
    var $hlinks = $('nav.secondary-menu_navigation .hidden-links');

    let numOfItems = 0;
    let totalSpace = 0;
    let breakWidths = [];

    let availableSpace;
    let numOfVisibleItems;
    let requiredSpace;
    // Get initial state
    $vlinks.children().outerWidth(function(i, w) {
      totalSpace += w;
      numOfItems += 1;
      breakWidths.push(totalSpace);
    });

    function check() {

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
    $(window).resize(function () {
      check();
    });

    $btn.on('click', function () {
      $hlinks.toggleClass('hidden');
    });

    check();
  });
});

Template.viewApiPageHeader.helpers({
  userShouldSeeBacklogTab () {
    // Get API id
    const apiId = this.api._id;
    const api = Apis.findOne(apiId);
    // Check if API Backlog exist or user allowed to see
    if (api && (api.backlogIsNotEmpty() || api.currentUserCanManage())) {
      return true;
    }
    return false;
  },
  userShouldSeeApiMetadataTab () {
    // Get API id
    const apiId = this.api._id;

    const api = Apis.findOne(apiId);

    // Check if API Metadata exist or user allowed to see
    if (api && (api.apiMetadataIsNotEmpty() || api.currentUserCanManage())) {
      return true;
    }
    return false;
  },
  userShouldSeeApiDocsTab () {
    // Get API id
    const apiId = this.api._id;

    const api = Apis.findOne(apiId);

    // Check if API documentation exist or user allowed to see
    if (api && (api.apiDocsIsNotEmpty() || api.currentUserCanManage())) {
      return true;
    }
    return false;
  },
});
