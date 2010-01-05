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
        console.log('solve it baby')
      } else {
        console.log('dont solve it ....')
        context.solveConflicts(couchapp);
      }
      $('#spinner').hide(); 
    });
  },
  
  solveConflicts: function(couchapp){
    var context = this;
    var count = 1;
    var outline_id = context.getOutlineId();

    performSolveConflicts = function(){
      console.log('solve conflicts #'+ count);
      count = count + 1;
      couchapp.design.view('notes_with_conflicts_by_outline', {
        key: outline_id,
        success: function(json) {
          // http://localhost:5984/doingnotes/006a7e4d29581a6ac485f86df1960e49?meta=true
          // http://localhost:5984/doingnotes/006a7e4d29581a6ac485f86df1960e49?conflicts=true (or _conflicts)
          // http://localhost:5984/doingnotes/006a7e4d29581a6ac485f86df1960e49?rev=3-1165509119322a7f70fe9d69b38f2a03
          // http://localhost:5984/doingnotes/_design/doingnotes/_view/notes_with_conflicts_by_outline?key=%22006a7e4d29581a6ac485f86df1960e49%22
          // http://localhost:5984/doingnotes/_design/doingnotes/_view/notes_with_conflicts_by_outline?startkey=%22006a7e4d29581a6ac485f86df1960e49%22&endkey=%22006a7e4d29581a6ac485f86df1960e49%22
          if (json.rows.length > 0) { 
            var notes_with_conflicts = json.rows.map(function(row) {return row.value});
            $.each(notes_with_conflicts, function(i, note){
              var url = context.localServer() + '/' + context.db() + '/' + note._id + '?rev=' + note._conflicts[0];
              $.getJSON(url, function(overwritten_note){
                console.log('overwritten_note: ', overwritten_note);
                $('#conflict-update').slideDown("slow");
              });
            });
          }    
        }
      });
      // setTimeout("performSolveConflicts()", 3000);
    }

    performSolveConflicts();
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