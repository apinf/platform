/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

Template.settingsMenu.onRendered(() => {

  // Mobile menu
  $(function() {

    var $nav = $('nav.secondary-menu_navigation');
    var $btn = $('nav.secondary-menu_navigation button');
    var $vlinks = $('nav.secondary-menu_navigation .links');
    var $hlinks = $('nav.secondary-menu_navigation .hidden-links');

    var numOfItems = 0;
    var totalSpace = 0;
    var breakWidths = [];

    // Get initial state
    $vlinks.children().outerWidth(function(i, w) {
      totalSpace += w;
      numOfItems += 1;
      breakWidths.push(totalSpace);
    });

    var availableSpace, numOfVisibleItems, requiredSpace;

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
      $btn.attr("count", numOfItems - numOfVisibleItems);
      if (numOfVisibleItems === numOfItems) {
        $btn.addClass('hidden');
      } else $btn.removeClass('hidden');
    }

    // Window listeners
    $(window).resize(function() {
      check();
    });

    $btn.on('click', function() {
      $hlinks.toggleClass('hidden');
    });

    check();

  });
});
