var OutlineHelpers = {
  bindSubmitOnBlurAndAutogrow: function(){
    $('textarea.expanding').autogrow();
    $('textarea.expanding').bind('focus', function(e){
      this.hasFocus = true;
    });
    $('textarea.expanding').bind('blur', function(e){
      this.hasFocus = false;      
      note = new NoteElement($(e.target));
      note.submitIfChanged();
    });
  },
  
  getOutlineId: function(){
    return this.$element().find('h2#outline-id').html();
  }
}