import { Mongo } from 'meteor/mongo';

const Organizations = new Mongo.Collection('Organizations');
// TODO: Remove it
const OrganizationApis = new Mongo.Collection('organizationApis');

export { Organizations, OrganizationApis };
