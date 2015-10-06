Template.documentation.created = function () {
  // Get reference to template instance
  var instance = this;

  // Create Reactive Variable for selected documentation
  instance.selectedDocumentation = new ReactiveVar();
};

Template.documentation.rendered = function () {
  $(function() {
    // Pass window url parameters into documentation IFRAME
    // http://stackoverflow.com/a/12944835/1191545

    // Get search parameter(s) from window location
    var search = window.location.search;

    // Create new iframe src by appending search parameter(s)
    var newSrc = $("#documentation").attr("src") + search;

    // Update iframe src attribute with new source
    $("#documentation").attr("src", newSrc);
  });
};
