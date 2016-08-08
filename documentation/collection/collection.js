const DocumentationFiles = new FileCollection('DocumentationFiles', {
  resumable: true,
  resumableIndexName: 'documentaion',
  http: [
    {
      method: 'get',
      path: '/id/:_id',
      lookup: function(params, query) {
        return {
          _id: params._id
        };
      }
    }
  ]
});

export { DocumentationFiles };
