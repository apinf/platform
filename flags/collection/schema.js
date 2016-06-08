ApiFlags.schema = new SimpleSchema({
  reason: {
    type: String,
    allowedValues: [
      'Inappropriate',
      'Defunct'
    ]
  },
  title: {
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
