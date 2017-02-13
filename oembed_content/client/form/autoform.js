// Close modal after successful insert/update
AutoForm.addHooks("postsForm",{
  onSuccess: function(){
    Modal.hide("postInsertModal");
  }
});
