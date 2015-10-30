Template.apiDocumentationSelect.created = function () {
  // Get reference to template instance
  var instance = this;

  // Subscribe to All API Documentation
  instance.subscribe('allApiDocumentation');
};

Template.apiDocumentationSelect.helpers({
  "apiDocumentation": function () {
    // Get API Documentation
    var apiDocumentationArray = ApiDocumentation.find().fetch();

    return apiDocumentationArray;
  }
});
