/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { FileCollection } from 'meteor/vsivsi:file-collection';

const DocumentationFiles = new FileCollection('DocumentationFiles', {
  resumable: true,
  resumableIndexName: 'documentation',
  http: [
    {
      method: 'get',
      path: '/id/:_id',
      lookup (params) {
        return {
          _id: params._id,
        };
      },
    },
  ],
});

export default DocumentationFiles;
