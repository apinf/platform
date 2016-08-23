import { DocumentationFiles } from '../../collection';

Meteor.methods({
  findFileById:function(id){
    const objectId = new Mongo.Collection.ObjectID(id);
    return DocumentationFiles.findOne(objectId);
  },
  findByMimeType: function(mimeType){
    return DocumentationFiles.find({'contentType': mimeType}).fetch();
  }
});
