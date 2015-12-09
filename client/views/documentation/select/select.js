Template.apiDocumentationSelect.created = function () {
  // Get reference to template instance
  var instance = this;

  // Subscribe to All API Documentation
  instance.subscribe('allApiDocs');
};

Template.apiDocumentationSelect.helpers({
  "apiDocumentation": function () {
    // Get API Documentation
    var apiDocumentationArray = ApiDocs.find().fetch();

    return apiDocumentationArray;
  }
});
