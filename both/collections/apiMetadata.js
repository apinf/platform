ApiMetadata = new Mongo.Collection("apiMetadata");

ApiMetadata.schema = new SimpleSchema({
  "apiBackendId": {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  "organization": {
    type: Object,
    optional: true
  },
  "organization.name": {
    type: String,
    optional: true
  },
  "organization.description": {
    type: String,
    optional: true
  },
  "contact": {
    type: Object,
    optional: true
  },
  "contact.name": {
    type: String,
    optional: true
  },
  "contact.phone": {
    type: String,
    optional: true
  },
  "contact.email": {
    type: String,
    optional: true
  },
  "service": {
    type: Object,
    optional: true
  },
  "service.name": {
    type: String,
    optional: true
  },
  "service.description": {
    type: String,
    optional: true
  },
  "service.validSince": {
    type: Date,
    optional: true
  },
  "service.validUntil": {
    type: Date,
    optional: true
  },
  "service.serviceLevelAgreement": {
    type: String,
    optional: true
  }
});

ApiMetadata.attachSchema(ApiMetadata.schema);

ApiMetadata.allow({
  "insert": function (userId, doc) {
    var apiBackendId = doc.apiBackendId;
    // Make sure there is only one document per API Backend ID
    if(ApiMetadata.find({apiBackendId}).count() !== 0) {
      return false;
    } else {
      // Find related API Backend that contains "managerIds" field
      var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

      // Try - Catch wrapper here because Mongodb call above can return zero matches
      try {
        // Get managerIds array from API Backend document
        var managerIds = apiBackend.managerIds;
      } catch (err) {
        // If no related document found return false - API Backend does not have any managers listed
        return false;
      }

      // Check if an array of managerIds contain user id passed
      var isManager = _.contains(managerIds, userId);
      // Check if user is administrator
      var isAdmin = Roles.userIsInRole(userId, ['admin']);

      // Check that user is either API manager OR Admin
      if(isManager || isAdmin) {
        return true;
      } else {
        return false;
      }
    }
  },
  "update": function (userId, doc) {
    var apiBackendId = doc.apiBackendId;
    // Find related API Backend that contains "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Try - Catch wrapper here because Mongodb call above can return zero matches
    try {
      // Get managerIds array from API Backend document
      var managerIds = apiBackend.managerIds;
    } catch (err) {
      // If no related document found return false - API Backend does not have any managers listed
      return false;
    }

    // Check if an array of managerIds contain user id passed
    var isManager = _.contains(managerIds, userId);
    // Check if user is administrator
    var isAdmin = Roles.userIsInRole(userId, ['admin']);

    // Check that user is either API manager OR Admin
    if(isManager || isAdmin) {
      return true;
    } else {
      return false;
    }
  }
});
