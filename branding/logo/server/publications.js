import { ProjectLogo } from '/branding/logo/collection';

Meteor.publish('projectLogo', function() {
  return ProjectLogo.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
