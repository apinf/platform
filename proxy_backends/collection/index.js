// Meteor packages imports
import { Mongo } from 'meteor/mongo';


const ProxyBackends = new Mongo.Collection('proxyBackends');

export default ProxyBackends;
