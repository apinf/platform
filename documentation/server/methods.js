import { documentationFiles } from '/documentation/collection/collection';

Meteor.methods({
  findFileById:function(id){
    const objectId = new Mongo.Collection.ObjectID(id);
    return documentationFiles.findOne(objectId);
  },
  findByMimeType: function(mimeType){
    return documentationFiles.find({'contentType': mimeType}).fetch();
  }
});
