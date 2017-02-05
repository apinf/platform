import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import DocumentationFiles from '/documentation/collection';

Meteor.methods({
  findFileById (id) {
    const objectId = new Mongo.Collection.ObjectID(id);
    return DocumentationFiles.findOne(objectId);
  },
  findByMimeType (mimeType) {
    return DocumentationFiles.find({ contentType: mimeType }).fetch();
  },
});
