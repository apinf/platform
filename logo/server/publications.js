import { ProjectLogo } from '/logo/collection/collection';

Meteor.publish('projectLogo', function() {
  return ProjectLogo.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
