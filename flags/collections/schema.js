ApiFlags.schema = new SimpleSchema({
  reason: {
    type: String,
    allowedValues: [
      'Inappropriate',
      'Defunct'
    ]
  },
  name: {
    type: String
  },
  desciption: {
    type: String,
    autoform: {
      rows: 5
    }
  },
  createdBy: {
    type: String
  },
  apiBackendId: {
    type: String
  }
});

ApiFlags.attachSchema(ApiFlags.schema);
