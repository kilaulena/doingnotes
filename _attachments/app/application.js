$(function() {
  var couchapp = null;
  $.CouchApp(function(app) {
    couchapp = app;
  });
  
  sammy = new Sammy.Application(function() { with(this) {
    element_selector = '#content';
    use(Sammy.Mustache);
    use(Sammy.Cache);
    use(Resources, couchapp);
    flash = {};
    Notes(this, couchapp);
    Outlines(this, couchapp);  
    ConflictResolver(this, couchapp);  
    helpers(OutlineHelpers);
    helpers(OutlineConflictHelpers);
    helpers(ReplicationHelpers);
    helpers(KeyEvents);
    helpers(Config);
    
    get('#/', function(){with(this) {
      redirect('#/outlines');
      return false;
    }});

    bind('init', function() { with(this) {
      var context = this;
      if(context.onServer()){
        $('#system').append("the server");
      } else {
        replicateUp();
        replicateDown();
        $('#system').append("the client");
      }
            
      $(window).bind("beforeunload", function(e){
        if($('li.edit-note').length > 0){
          var note = new NoteElement($('li[data-focus]').find('textarea'));
          note.setDataText();
          if(note.targetHasChanged()){
            note.submitIfChanged();
            alert("Please don't reload this page when you have typed into a line - first leave the line with keyup/keydown or with the mouse. Sorry for this annoying message.")
          }
        }
      });
      $(window).bind("click", function(e) {
        if(happenedOnNoteTarget(e)){
          var note = new NoteElement($(e.target));
          note.setDataText();
          note.focusTextarea();
        } else if(happenedOnConflictField(e)){
          var note = new NoteElement($(e.target));
          note.focusTextarea();
        }
      });
      $(window).bind("keydown", function(e) {
        if(happenedOnNoteTarget(e)){
          var note = new NoteElement($(e.target));
          note.setDataText();
          if (enterPressed(e)) {
            e.preventDefault();
            note.insertNewNote(context);
          } else if(keyUpPressed(e)){
            e.preventDefault();
            note.focusPreviousTextarea();
            note.submitIfChanged();
          } else if(keyDownPressed(e)){
            e.preventDefault();
            note.focusNextTextarea();
            note.submitIfChanged();
          } else if(tabPressed(e)){
            e.preventDefault();
            note.indent(context);
          } else if(tabShiftPressed(e)){
            e.preventDefault();
            note.unindent(context);
          }
        } else if(happenedOnConflictField(e)){
          var note = new NoteElement($(e.target));
          if(keyUpPressed(e)){
            e.preventDefault();
            note.focusPreviousTextarea();
          } else if(keyDownPressed(e)){
            e.preventDefault();
            note.focusNextTextarea();
          } else if(tabPressed(e) || tabShiftPressed(e)){
            e.preventDefault();
            note.focusOtherInlineTextarea();
          }
        }
      });
    }});
 
    before(function() {
      OutlineHelpers.displayAndHideFlash(flash);
      flash = {type: '', message: ''};
      $('#spinner').show();
    });

    bind('error', function(e, flash) { with(this) {
      flash.type = 'error';
      displayAndHideFlash(flash);
    }});

    bind('notice', function(e, flash) { with(this) {
      flash.type = 'notice';
      displayAndHideFlash(flash);
    }});
  }});

  sammy.run('#/');
  sammy.trigger('init');
});
