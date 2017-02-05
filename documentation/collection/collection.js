import { FileCollection } from 'meteor/vsivsi:file-collection';

const DocumentationFiles = new FileCollection('DocumentationFiles', {
  resumable: true,
  resumableIndexName: 'documentation',
  http: [
    {
      method: 'get',
      path: '/id/:_id',
      lookup (params, query) {
        return {
          _id: params._id,
        };
      },
    },
  ],
});

export { DocumentationFiles };

