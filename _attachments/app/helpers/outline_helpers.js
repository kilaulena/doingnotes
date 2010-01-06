var OutlineHelpers = {
  bindSubmitOnBlurAndAutogrow: function(){
    $('textarea.expanding').autogrow();
    $('textarea.expanding').bind('blur', function(e){
      note = new NoteElement($(e.target));
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
    return this.$element().find('h2#outline-id').html();
  },
  
  renderOutline: function(context, view, notes, couchapp, solve){
    context.render('show', view, function(response){
      context.app.swap(response);
      first_note = new NoteElement($('ul#notes li:first').find('textarea.expanding'));
      if(notes.notes.length > 1) {
        first_note.renderNotes(context, notes, notes.notes.length); 
      }
      first_note.focusTextarea();
      if(solve){
        context.showConflicts(couchapp);
      } else {
        context.checkForConflicts(couchapp);
      }
      $('#spinner').hide(); 
    });
  },
  
  showConflicts: function(couchapp){
    var context = this;
    var outline_id = context.getOutlineId();

    couchapp.design.view('notes_with_conflicts_by_outline', {
      key: outline_id,
      success: function(json) {
        if (json.rows.length > 0) { 
          var notes_with_conflicts = json.rows.map(function(row) {return row.value});
          $.each(notes_with_conflicts, function(i, note){
            var url = context.localServer() + '/' + context.db() + '/' + note._id + '?rev=' + note._conflicts[0];
            $.getJSON(url, function(overwritten_note_json){
              var note = new NoteElement(context.$element().find('li#edit_note_' + overwritten_note_json._id).find('textarea.expanding:first'))
              note.insertConflictFields(overwritten_note_json);
            });
          });
        }    
      }
    });
  },
  
  checkForConflicts: function(couchapp){
    var context = this;
    var count = 1;
    var outline_id = context.getOutlineId();

    performCheckForConflicts = function(){
      console.log('solve conflicts #'+ count);
      count = count + 1;
      couchapp.design.view('notes_with_conflicts_by_outline', {
        key: outline_id,
        success: function(json) {
          if (json.rows.length > 0) { 
            var notes_with_conflicts = json.rows.map(function(row) {return row.value});
            $.each(notes_with_conflicts, function(i, note){
              var url = context.localServer() + '/' + context.db() + '/' + note._id + '?rev=' + note._conflicts[0];
              $.getJSON(url, function(overwritten_note_json){
                var note = new NoteElement(context.$element().find('li#edit_note_' + overwritten_note_json._id).find('textarea.expanding:first'))
                note.emphasizeBackground();
              });
              $('#conflict-update').slideDown("slow");
            });
          }    
        }
      });
      // setTimeout("performCheckForConflicts()", 3000);
    }

    performCheckForConflicts();
  },
  
  replicateUp: function(){
    var context = this;    
    $.post(context.localServer()+ '/_replicate', 
      '{"source":"' + context.db() + '", "target":"' + context.server() + '/' + context.db()+ '", "continuous":true}',
      function(){
        Sammy.log('replicating to ', context.server() + '/' + context.db())
      },"json");
  },
  
  replicateDown: function(){
    var context = this;
    $.post(context.localServer()+ '/_replicate', 
      '{"source":"' + context.server() + '/' + context.db() + '", "target":"' + context.db() + '", "continuous":true}',
      function(){
        Sammy.log('replicating from ', context.server() + '/' + context.db())
      },"json");
  }, 
  
  db: function(){
    return "doingnotes"
  },
  
  server: function(){
    return "http://localhost:" + this.serverPort();
  },
  
  localServer: function(){
    return "http://localhost:" + this.localPort();
  },
  
  localPort: function(){
    return "5984";
  },
  
  serverPort: function(){
    return "5985";
  }
}