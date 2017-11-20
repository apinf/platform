/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// APInf imports
import ApiDocs from '/apinf_packages/api_docs/collection';
import DocumentationFiles from '/apinf_packages/api_docs/files/collection';

// Npm packages imports
import SwaggerParser from 'swagger-parser';
import Future from 'fibers/future';

Meteor.methods({
  checkData (parseData) {
    // Check type of parseData is Object
    check(parseData, Object);
    try {
      if (!parseData) {
        throw new Error({ status: 'error', message: 'No api data found' });
      }
      if (!parseData.info || !parseData.info.title || !parseData.info.description) {
        throw new Error({ status: 'error', message: 'No api title or description found' });
      }
      if (!parseData.schemes || !parseData.host || !parseData.basePath) {
        throw new Error({
          status: 'error',
          message: 'No api url found or api url not in correct format',
        });
      }
      return { status: 'success', message: 'all data is in correct format' };
    } catch (error) {
      return error;
    }
  },
  insertApiDoc () {
    const apiDocId = ApiDocs.insert({ type: 'file' });
    return apiDocId
  },
  parseDataByUrl (parseData) {
    // Check type of url is String
    check(parseData, Object);
    // Define a variable as Future
    const future = new Future();
    // Getting data from url and validate the data
    SwaggerParser.validate(parseData.url)
    .then((api) => {
      if (!api) {
        throw new Error({ status: 'error', message: 'No api data found' });
      }
      if (!api.info || !api.info.title || !api.info.description) {
        throw new Error({ status: 'error', message: 'No api title or description found' });
      }
      if (!api.schemes || !api.host || !api.basePath) {
        throw new Error({
          status: 'error',
          message: 'No api url found or api url not in correct format',
        });
      }
      const apiDocData = {
        type: 'url',
        remoteFileUrl: parseData.url,
      };
      Meteor.call('updateApiDocById', parseData.docId, apiDocData);
      future.return({ status: 'success', docId: parseData.docId, data: api });
    })
    .catch((err) => {
      future.return({ status: 'error', data: err });
    });
    return future.wait();
  },
  updateApiDoc (docData) {
    // Create new api doc
    check(docData, Object);
    const objectId = new Mongo.Collection.ObjectID(docData.docId)
    DocumentationFiles.update(objectId, {
      $set: {
        filename: docData.filename,
        contentType: docData.contentType,
      },
    });
    const apiDocId = ApiDocs.update(docData.apiDocId, {
      $set: { 
        type: 'file',
        fileId: docData.docId, 
      },
    });
    return apiDocId;
  },
  updateApiIdInDoc (apiId, docId) {
    // Update api id in api doc
    check(apiId, String);
    check(docId, String);

    ApiDocs.update(docId, {
      $set: { apiId },
    });
  },
  updateApiDocById (docId, apiDocData) {
    // Update api doc with some data
    check(docId, String);
    check(apiDocData, Object);
    ApiDocs.update(docId, { $set: apiDocData });
  },
  removeApiDocById (docId) {
    // Remove api doc by id
    check(docId, String);
    ApiDocs.remove(docId);
  },
  checkApiIdInDoc (docId) {
    check(docId, String);
    // Check api doc available or not
    const apiDoc = ApiDocs.findOne({ _id: docId, apiId: { $exists: true, $ne: null } });
    return apiDoc || false;
  },
});
