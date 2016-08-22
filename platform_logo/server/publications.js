import { ProjectLogo } from '../collection';

Meteor.publish('projectLogo', function() {
  return ProjectLogo.find({
    'metadata._Resumable': {
      $exists: false
    }
  });
});
