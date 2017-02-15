// Collection imports
import { ApiUmbrellaAdmins, ApiUmbrellaUsers } from '../';

Meteor.publish('apiUmbrellaAdmins', () => {
  // Get ApiUmbrellaAdmins collection object
  return ApiUmbrellaAdmins.find();
});

Meteor.publish('apiUmbrellaUsers', () => {
  // Get ApiUmbrellaUsers collection object
  return ApiUmbrellaUsers.find();
});
