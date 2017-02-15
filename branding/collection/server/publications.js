// Collection imports
import Branding from '/branding/collection';

Meteor.publish('branding', () => {
  // Get Branding collection object
  return Branding.find();
});
