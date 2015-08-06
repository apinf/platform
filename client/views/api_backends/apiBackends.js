Template.apiBackends.rendered = function () {

  // hide sub-settings custom rate limit block on load
  $('#sub-settings-custom-rate-limit').hide();

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

Template.apiBackends.events({
  'change select[name="sub_settings.0.rate_limit_mode"]': function (event, template) {
    // show if custom rate limits is chosen
    if (event.target.value === 'Custom rate limits') {
      $('#sub-settings-custom-rate-limit').show();
    }
    // hide again if not
    else {
      $('#sub-settings-custom-rate-limit').hide();
    }
  }
});
