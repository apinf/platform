// Meteor packages imports
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  fetchVersionData () {
    const myFile = JSON.parse(Assets.getText('versions.json'));
    return myFile;
  },
});
