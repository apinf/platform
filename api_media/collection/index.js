import { Mongo } from 'meteor/mongo';

const Posts = new Mongo.Collection('posts');
export default Posts;

// This code only runs on the server
if (Meteor.isServer) {
  // Use pagination when posts are requested
  new Meteor.Pagination(Posts);
}
