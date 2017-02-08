import { Posts } from './';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
const postsSchema = new SimpleSchema({
  title: {
    type: String,
    autoform: {
      placeholder: 'Give post title',
    }
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      placeholder: 'Give post URL',
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
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  userId: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.userId()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  username: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.user().username;
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.user().username};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },

});
Posts.attachSchema(postsSchema);
