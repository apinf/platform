// Collection imports
import DocumentationFiles from '/documentation/collection';

Meteor.methods({
  findFileById (id) {
    // Make sure id is a String
    check(id, String);

    const objectId = new Mongo.Collection.ObjectID(id);
    return DocumentationFiles.findOne(objectId);
  },
  findByMimeType (mimeType) {
    // Make sure mimeType is a String
    check(mimeType, String);

    return DocumentationFiles.find({ contentType: mimeType }).fetch();
  },
});
