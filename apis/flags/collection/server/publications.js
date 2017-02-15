// Collection imports
import ApiFlags from '../';

Meteor.publish('singleApiFlag', (apiBackendId) => {
  // Make sure apiBackendId is a String
  check(apiBackendId, String);

  // Fetch api flag by api backend id
  const flag = ApiFlags.find({ apiBackendId });

  return flag;
});
