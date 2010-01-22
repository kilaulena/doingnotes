var OutlineHelpers = {
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
    context.render('show', view, function(response){
      context.app.swap(response);
      var first_note = new NoteElement($('ul#notes li:first').find('textarea.expanding'));
      if(notes.notes.length > 1) {
        first_note.renderNotes(context, notes, notes.notes.length); 
      }
      first_note.focusTextarea();
      context.checkForUpdates(couchapp);
      var continue_conflict_checking = true;
      if(solve){
        continue_conflict_checking = false;
        context.showConflicts(couchapp);
      } else {
        context.checkForConflicts(couchapp, continue_conflict_checking);
      }
      $('#spinner').hide(); 
    });
  }
}
