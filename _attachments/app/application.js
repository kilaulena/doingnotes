$(function() {
  var couchapp = null;
  $.CouchApp(function(app) {
    couchapp = app;
  });
  
  sammy = new Sammy.Application(function() { with(this) {
    element_selector = '#content';
    config = window.Config;
    use(Sammy.Mustache);
    use(Sammy.Cache);
    use(Resources, couchapp);
    flash = {};
    helpers(OutlineHelpers);
    helpers(OutlineConflictHelpers);
    helpers(ReplicationHelpers);
    helpers(KeyEvents);
    Notes(this, couchapp);
    Outlines(this, couchapp);
    
    get('#/', function(){with(this) {
      redirect('#/outlines');
      return false;
    }});

    bind('init', function() {
      var context = this;
      if(this.onServer()){
        $('#system').append("the server");
      } else {
        this.replicateUp();
        this.replicateDown();
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
        if(context.happenedOnNoteTarget(e)){
          var note = new NoteElement($(e.target));
          note.setDataText();
          note.focusTextarea();
        } else if(context.happenedOnConflictField(e)){
          var note = new NoteElement($(e.target));
          note.focusTextarea();
        }
      });
      $(window).bind("keydown", function(e) {
        if(context.happenedOnNoteTarget(e)){
          var note = new NoteElement($(e.target));
          note.setDataText();
          if (context.enterPressed(e)) {
            e.preventDefault();
            note.insertNewNote(context);
          } else if(context.keyUpPressed(e)){
            e.preventDefault();
            note.focusPreviousTextarea();
            note.submitIfChanged();
          } else if(context.keyDownPressed(e)){
            e.preventDefault();
            note.focusNextTextarea();
            note.submitIfChanged();
          } else if(context.tabPressed(e)){
            e.preventDefault();
            note.indent(context);
          } else if(context.tabShiftPressed(e)){
            e.preventDefault();
            note.unindent(context);
          }
        } else if(context.happenedOnConflictField(e)){
          var note = new NoteElement($(e.target));
          if(context.keyUpPressed(e)){
            e.preventDefault();
            note.focusPreviousTextarea();
          } else if(context.keyDownPressed(e)){
            e.preventDefault();
            note.focusNextTextarea();
          } else if(context.tabPressed(e) || context.tabShiftPressed(e)){
            e.preventDefault();
            note.focusOtherInlineTextarea();
          }
        }
      });
    });
 
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
