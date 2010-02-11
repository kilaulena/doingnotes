var OutlineHelpers = {
  onServer: function(){
     return (window.location.protocol + '//' + window.location.host == config.SERVER)
   }, 
   
  bindSubmitOnBlurAndAutogrow: function(){
    $('textarea.expanding').autogrow();
    $('textarea.expanding').bind('blur', function(e){
      var note = new NoteElement($(e.target));
      note.setDataText();
      note.unfocusTextarea();
      note.submitIfChanged();
    });
    $("a.image").bind("click", function(){
      $(this).parent().next('ul.indent').toggle();
      $(this).toggleClass('down');
      return false;
    });
  },
  
  unbindSubmitOnBlurAndAutogrow: function(){
    $('textarea.expanding').unbind('blur');
    $('textarea.expanding').unbind('focus');
    $('a.image').unbind('click');		
  },
  
  bindSolveConflictsFocus: function(){
    $('textarea.solve_text').bind('blur', function(e){
      note = new NoteElement($(e.target));
      note.unfocusTextarea();
    });
  },
  
  getOutlineId: function(){
    if((this.$element().find('h2#outline-id')).length != 0){
      return this.$element().find('h2#outline-id').html();
    }
  },
  
  displayAndHideFlash: function(flash){
    $('#flash').attr('class', flash.type);
    $('#flash').html(flash.message);
    $('#flash').show();
    $('#spinner').hide();    
    setTimeout("$('#flash').fadeOut('slow')", 5000);
  },
  
  renderOutline: function(context, view, notes, couchapp, solve){
    this.render('show', view, function(response){
      this.app.swap(response);
      this.checkForNewUpdatesAndConflictsOrShow(couchapp, solve);
      var first_note = new NoteElement($('ul#notes li:first').find('textarea'));
      if(notes.notes.length > 1) {
        first_note.renderNotes(context, notes, notes.notes.length); 
      }
      first_note.focusTextarea();
      $('#spinner').hide(); 
    });
  }
}
