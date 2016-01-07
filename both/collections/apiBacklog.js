ApiBacklog = new Mongo.Collection('apiBacklog');

Schemas.ApiBacklog = new SimpleSchema({
  'userId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'text': {
    type: String,
    label: "Text",
    max: 1000,
    optional: false,
    autoform: {
      rows: 5,
      placeholder: 'Type backlog title/description here'
    }
  },
  'priority': {
    type: String,
    label: 'Priority',
    allowedValues: ['Critical', 'High', 'Middle', 'Low', 'None'],
    autoform: {
      options: [
        { label: "Critical", value: "Critical" },
        { label: "High", value: "High" },
        { label: "Middle", value: "Middle" },
        { label: "Low", value: "Low" },
        { label: "None", value: "None" }
      ]
    }
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true
  }
});

ApiBacklog.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});
