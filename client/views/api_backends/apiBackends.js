Template.apiBackends.rendered = function () {

  // Hides blocks on template load
  $('#global-request-block, #sub-url-block, #advanced-block').collapse({
    hide: true
  });

  // Toggles icon on hide and show events
  $('#global-request-block, #sub-url-block, #advanced-block').on('shown.bs.collapse', function () {
    $(this).prev().find(".glyphicon").removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
  });
  $('#global-request-block, #sub-url-block, #advanced-block').on('hidden.bs.collapse', function () {
    $(this).prev().find(".glyphicon").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right");
  });
}
