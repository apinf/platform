import { ProjectLogo } from '/settings/logo/collection';

Meteor.publish('projectLogo', function() {
  return ProjectLogo.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
