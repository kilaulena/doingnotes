var OutlineConflictHelpers = {
  findNoteElementById: function(id ){
    return new NoteElement(this.$element().find('li#edit_note_' + id).find('textarea.expanding:first'))
  },

  highlightNoteShort: function(context, id){
    var note_element = context.findNoteElementById(id);
    note_element.emphasizeBackground(context, true);
  },
  
  highlightNote: function(context, id){
    var note_element = context.findNoteElementById(id);
    note_element.emphasizeBackground(context, false);
  },
  
  bindSolveConflictsFocus: function(){
    $('textarea.solve_text').bind('blur', function(e){
      note = new NoteElement($(e.target));
      note.unfocusTextarea();
    });
  },
  
  showWriteConflictWarning: function(context){
    if(context.$element().find('#conflict-warning:visible').length == 0){
      $('#conflict-warning').slideDown('slow');
    }  
  }
}