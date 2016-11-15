import { Template } from 'meteor/templating';

Template.granularity.events({
  'change #date-granularity-selector': function (event) {
    console.log(event.target.value);
  },
});
