// Collection imports
import Apis from '../';

// Create indexes for fields in MongoDB collection (API backends search functionality)
// TODO: shouldn't it be during Meteor.startup?
//       ref: http://joshowens.me/how-to-optimize-your-mongo-database-for-meteor-js/
// eslint-disable-next-line no-underscore-dangle
Apis._ensureIndex({
  name: 1,
  backend_host: 1,
});
