Template.documentation.created = function () {
  // Get reference to template instance
  var instance = this;

  // Create Reactive Variable for selected documentation
  instance.swaggerDocumentUrl = new ReactiveVar();
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

Template.documentation.events({
  "change [name='selected-documentation']": function (event) {
    // Get reference to template instance
    var instance = Template.instance();

    // Set Swagger document URL to selected value
    instance.swaggerDocumentUrl.set(event.target.value);
  },
  'load #documentation': function () {

  }
});

Template.documentation.helpers({
  "swaggerDocumentUrl": function () {
    // Get reference to template instance
    var instance = Template.instance();

    // Get the Swagger document URL
    var swaggerDocumentUrl = instance.swaggerDocumentUrl.get();

    return swaggerDocumentUrl;
  }
});
