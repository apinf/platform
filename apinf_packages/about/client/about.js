// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.aboutApinf.onRendered(() => {
  Meteor.call('fetchVersionData', (error, result) => {
    $('#show_branch').text(result.branch);
    $('#show_commit').text(result.commit);
    $('#show_tag').text(result.tag);
  });
});
