import { Mongo } from 'meteor/mongo';

const OrganizationApis = new Mongo.Collection('organizationApis');

export { OrganizationApis };
