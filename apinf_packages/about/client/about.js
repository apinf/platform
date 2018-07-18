// Meteor packages imports
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';


Template.about.helpers({
  showVersion () {
  	return 1.2;
  },
  showBranch () {
    return  1.2;
  },
  showCommit () {
    return  1.2
  },
  showTag () {
    return  1.2
  }
});