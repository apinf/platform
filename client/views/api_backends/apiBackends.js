Template.apiBackends.rendered = function () {
  // Hides blocks on template load
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block').collapse({
    hide: true
  });

  // Toggles icon on hide and show events
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block').on('shown.bs.collapse', function () {
    $(this).prev().find(".fa").removeClass("fa-chevron-right").addClass("fa-chevron-down");
  });
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block').on('hidden.bs.collapse', function () {
    $(this).prev().find(".fa").removeClass("fa-chevron-down").addClass("fa-chevron-right");
  });
}
