var OutlineHelpers = {
  bindSubmitOnBlurAndAutogrow: function(){
    $('textarea.expanding').autogrow();
    $('textarea.expanding').bind('blur', function(e){
      note = new NoteElement($(e.target));
      note.unfocusTextarea();
      note.submitIfChanged();
    });
  },
  
  getOutlineId: function(){
    return this.$element().find('h2#outline-id').html();
  },
  
  renderOutline: function(context, view, notes){
    context.render('show', view, function(response){
      context.app.swap(response);
      first_note = new NoteElement($('ul#notes li:first').find('textarea.expanding'));
      if(notes.notes.length > 1) {
        first_note.renderNotes(context, notes); 
      }
      first_note.focusTextarea();
      context.bindSubmitOnBlurAndAutogrow();
      $('#spinner').hide(); 
    });     
  }
}