Meteor.methods({

  "removeApiBackend": function(userId, doc) {
    console.log("TEST");
    ApiBackends.after.remove(function(userId, doc) {
      ApiBacklogItems.remove({apiBackendId:doc._id});
      Feedback.remove({apiBackendId: doc._id});
      ApiMetadata.remove({apiBackendId: doc._id});
      ApiDocs.remove({apiBackendId: doc._id});
    });
    console.log("DONE");
  }
});
