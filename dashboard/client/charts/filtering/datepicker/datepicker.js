import { Template } from 'meteor/templating';

Template.timeFrameSelectPicker.onRendered(function () {

  const instance = this;

  this.$('.input-daterange').datepicker({
    format: "dd.mm.yyyy",
    autoclose: true,
    todayHighlight: true
  });

})
