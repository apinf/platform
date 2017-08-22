/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Collection imports
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';

Meteor.publish(
  'singleDocumentationFile', (fileId) => {
    // Make sure documentationFileId
    check(fileId, String);

    // Convert _id value to Object Id instance
    const objectId = new Mongo.Collection.ObjectID(fileId);

    return DocumentationFiles.find({
      _id: objectId,
      'metadata._Resumable': {
        $exists: false,
      },
    });
  });
