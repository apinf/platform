Template.steps_bootstrap3.helpers({
  stepClass: function(id) {
    var activeStep = this.wizard.activeStep();
    var step  = this.wizard.getStep(id);
    if (activeStep && activeStep.id === id) {
      return 'active';
    }
    if (step.data()) {
      return 'completed';
    }
    return 'disabled';
  }
});
