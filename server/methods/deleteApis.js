Meteor.methods({
  // remove document and its references in ApiBackends, ApiBacklogItems, 
  // Feedback, ApiMetadata and ApiDocs collections
  "removeApiBackend": function(apiBackendId) {
    ApiBackends.remove(apiBackendId);
    ApiBacklogItems.remove({"apiBackendId": apiBackendId});
    Feedback.remove({"apiBackendId": apiBackendId});
    ApiMetadata.remove({"apiBackendId": apiBackendId});
    ApiDocs.remove(apiBackendId);
  }

});
