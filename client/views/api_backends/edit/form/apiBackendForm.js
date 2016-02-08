Template.apiBackendForm.helpers({
  'formType': function () {
    // Get reference to current Router
    var router = Router.current();

    // Check for '_id' parameter in route
    if (router.params._id) {
      // Updating existing API Backend
      return 'update';
    } else {
      // Editing new API Backend
      return 'insert';
    }
  }
});


Template.apiBackendForm.rendered = function () {
  // Hides blocks on template load
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block, #documentation-block').collapse({
    hide: true
  });

  // Toggles icon on hide and show events
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block, #documentation-block').on('shown.bs.collapse', function () {
    $(this).prev().find(".fa").removeClass("fa-chevron-right").addClass("fa-chevron-down");
  });
  $('#global-request-block, #sub-url-block, #advanced-block, #advanced-rewriting-block, #documentation-block').on('hidden.bs.collapse', function () {
    $(this).prev().find(".fa").removeClass("fa-chevron-down").addClass("fa-chevron-right");
  });
}
