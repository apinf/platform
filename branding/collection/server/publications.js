// Meteor package import
import { Meteor } from 'meteor/meteor';
// Apinf collections import
import Branding from '/branding/collection';

Meteor.publish('branding', () => {
  // Get Branding collection object
  return Branding.find();
});
