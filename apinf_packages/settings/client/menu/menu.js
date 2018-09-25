/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.settingsMenu.onRendered(() => {
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
});
