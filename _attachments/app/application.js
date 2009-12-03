$(function() {
  var couchapp = null;
  $.CouchApp(function(app) {
    couchapp = app;
  });
  sammy = new Sammy.Application(function() { with(this) {
    element_selector = '#content';
    use(Sammy.Mustache);
    use(Resources, couchapp);
    flash = {};
    Notes(this);
    Outlines(this, couchapp);    
    helpers(OutlineHelpers);
    helpers(KeyEvents);
    helpers(Focusing);
    helpers(Indenting);
    helpers(Inserting);
    
    get('#/', function(){with(this) {
      redirect('#/outlines');
      return false;
    }});

    bind('init', function() { with(this) {
      $(window).bind("keydown", function(e) {
        if(happenedOnNote(e)){
          var target = $(e.target);
          var note = new NoteElement(target);
          if (typeof(target.attr("data-text"))=="undefined") { 
            target.attr("data-text", target.val()); 
          };
          if (enterPressed(e)) {
            e.preventDefault();
            note.insertAndFocusNewNoteAndSubmit();
          } else if(keyUpPressed(e)){
            e.preventDefault();
            focusPreviousTextarea(target);
            submitIfChanged(target);
          } else if(keyDownPressed(e)){
            e.preventDefault();
            focusNextTextarea(target);
            submitIfChanged(target);
          } else if(tabPressed(e)){
            e.preventDefault();
            indent(target);
          } else if(tabShiftPressed(e)){
            e.preventDefault();
            unindent(target);
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
