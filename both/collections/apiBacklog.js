import { ApiBackends } from '/apis/collection/backend';

ApiBacklogItems = new Mongo.Collection("apiBacklogItems");

ApiBacklogItems.attachSchema(new SimpleSchema({
  title: {
    type: String,
    max: 100
  },
  details: {
    type: String,
    max: 1000,
    autoform: {
      rows: 5
    }
  },
  priority: {
    type: Number,
    min:0,
    max:2,
    autoform: {
      options: [
        { label: "High", value: 2 },
        { label: "Middle", value: 1 },
        { label: "None", value: 0 }
      ]
    }
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    autoValue: function () {
      return Meteor.userId();
    }
  },
  apiBackendId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  createdAt: {
    type: Date,
    autoValue: function () {

      // Check if mongoDB insert operation is initial
      if (this.isInsert)
        return new Date();

      // Check if mongoDB insert operation is initial
      else if (this.isUpsert)
        return { $setOnInsert: new Date() };

      // If not - field is not updated
      else
        this.unset();
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  }
}).i18n("schemas.backlog"));

ApiBacklogItems.allow({
  insert: function (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    var apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
  update: function (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    var apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
  remove: function (userId, backlog) {
    /*
    API Backlog shares permissions with API backend
    */

    // Get API Backend ID
    var apiBackendId = backlog.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
