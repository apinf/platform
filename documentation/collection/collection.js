const DocumentationFiles = FileCollection({
  resumable: true,
  resumableIndexName: 'test',
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
