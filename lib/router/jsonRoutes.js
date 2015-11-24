JsonRoutes.add("get", "cfs/files/apiDocumentation/:id/:file", function (req, res, next) {

  var id = req.params.id;

  var b = [];

  var doc = ApiDocumentation.findOne(id);

  var readStream = doc.createReadStream();

  var buffer = new Buffer(0);

  readStream.on('readable', function() {
    buffer = Buffer.concat([buffer, readStream.read()]);
  });

  readStream.on('end', function() {
    console.log(buffer.toString('base64'));
  });

  //JsonRoutes.sendResult(res, 200, b );
});
