Template.documentation.created = function () {
  // Get reference to template instance
  var instance = this;

  // Create Reactive Variable for selected documentation
  instance.swaggerDocumentUrl = new ReactiveVar();
};

Template.documentation.rendered = function () {

  console.log("Hello");

  var swaggerUi = new SwaggerUi({
    url:"http://petstore.swagger.io/v2/swagger.json",
    dom_id:"swagger-ui-container"
  });
  swaggerUi.load();
  console.log("Hello");
};

Template.documentation.events({
  "change [name='selected-documentation']": function (event) {
    // Get reference to template instance
    var instance = Template.instance();

    // Set Swagger document URL to selected value
    instance.swaggerDocumentUrl.set(event.target.value);
  },
  "load #documentation": function () {

    // gets current users object
    var user = Meteor.user();

    // gets current user's apiKey
    var apiKey = user.profile.apiKey;

    // passes api key to iFrame once it is loaded
    $("#documentation").contents().find("#input_apiKey").val(apiKey);
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
