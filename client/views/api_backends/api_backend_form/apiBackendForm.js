Template.apiBackendForm.helpers({
  'formType': function () {
    // check for router id parameter
    var router = Router.current()
    // check for form type
    if (router.params._id) {
      return 'insert';
    } else {
      return 'update';
    }
  }
});

Template.apiBackendForm.created = function () {
  // Subscription to apiBackends collection
  this.subscribe('apiBackend');
};


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

