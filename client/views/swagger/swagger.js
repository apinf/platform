Template.swagger.rendered = function () {
  $(function() {
    // Pass window url parameters into Swagger IFRAME
    // http://stackoverflow.com/a/12944835/1191545

    // Get search parameter(s) from window location
    var search = window.location.search;

    // Create new iframe src by appending search parameter(s)
    var newSrc = $("#swagger").attr("src") + search;

    // Update iframe src attribute with new source
    $("#swagger").attr("src", newSrc);
  });
};
