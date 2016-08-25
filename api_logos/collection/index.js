const ApiLogos = new FileCollection('ApiLogos', {
  resumable: true,
  resumableIndexName: 'apilogos',
  http: [
    {
      method: 'get',
      path: '/md5/:md5',
      lookup: function(params) {
        return {
          md5: params.md5
        };
      }
    }
  ]
});

export { ApiLogos };
