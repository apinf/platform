// CoverPhoto = new FS.Collection("coverPhoto", {
//   stores: [
//     new FS.Store.GridFS("coverPhoto")
//   ]
// });
//
// CoverPhoto.filters({
//   allow: {
//     maxSize: 10048567, // ~ 10Mbs.
//     extensions: ['jpg', 'jpeg', 'png', 'gif']
//   },
//   onInvalid: function (message) {
//     // Show error message if it doesn't pass filter settings
//     FlashMessages.sendError(message);
//   }
// });
//
// if (Meteor.isServer) {
//   CoverPhoto.allow({
//     insert: function(userId, doc) {
//       return Roles.userIsInRole(userId, ['admin']);
//     },
//     update: function(userId, doc, fieldNames, modifier) {
//       return Roles.userIsInRole(userId, ['admin']);
//     },
//     download: function(userId) {
//       return true;
//     },
//     remove: function() {
//       return true;
//     }
//   });
// }
