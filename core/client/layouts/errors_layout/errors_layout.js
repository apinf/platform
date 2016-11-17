import { Template } from 'meteor/templating';
import $ from 'jquery';

Template.errorsLayout.onRendered(() => {
  $('.go-back').click(() => {
    history.go(-1);
    return false;
  });
});
