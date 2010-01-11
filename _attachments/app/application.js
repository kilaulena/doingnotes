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
    Notes(this);
    Outlines(this, couchapp);    
    helpers(OutlineHelpers);
    helpers(KeyEvents);
    
    get('#/', function(){with(this) {
      redirect('#/outlines');
      return false;
    }});

    get('#/updates', function(){with(this) {
      $('#spinner').show();
      $('#spinner').hide();
      return false;
    }});

    bind('init', function() { with(this) {
      var context = this;
      replicateUp();
      replicateDown();
            
      $(window).bind("beforeunload", function(e){
        var note = new NoteElement($('li[data-focus]').find('textarea'));
        note.setDataText();
        if(note.targetHasChanged()){
          note.submitIfChanged();
          alert("Please don't reload this page when you have typed into a line - first leave the line with keyup/keydown or with the mouse. Sorry for this annoying message.")
        }
      });
      $(window).bind("click", function(e) {
        if(happenedOnNoteTarget(e)){
          var note = new NoteElement($(e.target));
          note.setDataText();
          note.focusTextarea()
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
        }
      });
    }});
 
    before(function() {
      $('#flash').html(flash.message);
      $('#flash').attr('class', flash.type);
      flash = {type: '', message: ''};
      $('#spinner').show();
    });

    bind('error', function(e, flash) { with(this) {
      $('#flash').html(flash.message);
      $('#flash').attr('class', 'error');
      $('#spinner').hide();
    }});

    bind('notice', function(e, flash) { with(this) {
      $('#flash').html(flash.message);
      $('#flash').attr('class', 'notice');
    }});
  }});

  sammy.run('#/');
  sammy.trigger('init');
  
});
