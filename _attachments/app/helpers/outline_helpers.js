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
    $('a.image').unbind('click');
  },
  
  getOutlineId: function(){
    return this.$element().find('h2#outline-id').html();
  },
  
  renderOutline: function(context, view, notes){
    context.render('show', view, function(response){
      context.app.swap(response);
      first_note = new NoteElement($('ul#notes li:first').find('textarea.expanding'));
      if(notes.notes.length > 1) {
        first_note.renderNotes(context, notes, notes.notes.length); 
      }
      first_note.focusTextarea();
      $('#spinner').hide(); 
    });     
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
    return window.location.port;
  },
  
  serverPort: function(){
    if(window.location.port == "5984") return "5985"
    else return "5984"
  }
}