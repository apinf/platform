const ApiLogo = new FileCollection('ApiLogo', {
  resumable: true,   // Enable built-in resumable.js upload support
  http: [
    { method: 'get',
     path: '/md5/:md5',  // this will be at route "/gridfs/ApiLogos/:md5"
     lookup: function (params, query) {  // uses express style url params
       return { md5: params.md5 };       // a query mapping url to ApiLogos
     }
    }
  ]
});

export { ApiLogo };
