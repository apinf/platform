import { Mongo } from 'meteor/mongo';

const ApiUmbrellaAdmins = new Mongo.Collection('apiUmbrellaAdmins');
const ApiUmbrellaUsers = new Mongo.Collection('apiUmbrellaUsers');

export { ApiUmbrellaAdmins, ApiUmbrellaUsers };
