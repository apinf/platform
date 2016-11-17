import { Template } from 'meteor/templating';
import $ from 'jquery';

Template.goBackButton.onRendered(() => {
  $('#go-back').click(() => {
    history.go(-1);
    return false;
  });
});
