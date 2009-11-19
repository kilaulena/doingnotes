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
    
    get('#/', function(){with(this) {
      redirect('#/outlines');
      return false;
    }});
    
    function happenedOnNote(event){
      return (event.target.tagName == 'TEXTAREA' && $(event.target).attr('class', 'expanding'));
    };
    
    function enterPressed(event) {
      return (event.keyCode == 13 && event.shiftKey == false);
    };
    
    function keyUpPressed(event) {
      return (event.keyCode == 38 && event.shiftKey == false);
    };
    
    function keyDownPressed(event) {
      return (event.keyCode == 40 && event.shiftKey == false);
    };
    
    function tabPressed (event) {
      return (event.keyCode == 9 && event.shiftKey == false);
    };
    
    function tabShiftPressed (event) {
      return (event.keyCode == 9 && event.shiftKey == true);
    };
    
    function submitIfChanged(target) {
      if(target.attr("data-text") != target.val()) {
        target.removeAttr("data-text");
        target.parent('form').submit();
      }
    };
    
    this.helpers({
      bindSubmitOnBlurAndAutogrow: function(){
        $('textarea.expanding').autogrow();
        $('textarea.expanding').bind('blur', function(e) {
          submitIfChanged($(e.target));
        });
      },
      getNoteId: function(element){
        return element.attr('id').match(/edit_text_(\w*)/)[1];
      },
      getNextNoteId: function(context, element){
        if(element.parent().parent().next().length > 0){
          return context.getNoteId(element.parent().parent().next().find('textarea'));
        };
      },
      getPreviousNoteId: function(context, element){
        if(element.parent().parent().prev().length > 0){
          return context.getNoteId(element.parent().parent().prev().find('textarea'));
        };
      },
      insertAndFocusNewNote: function(target) { 
        var context = this;  
        var target_id = context.getNoteId(target);
        var next_id = context.getNextNoteId(context, target);
        context.create_object('Note', {text: '', outline_id: $('h2#outline-id').html(), previous_id: target_id}, {}, function(note){      
          if(typeof(next_id)!="undefined"){
            context.update_object('Note', {id: next_id, previous_id: note.id}, {}, function(note){});
          }
          context.partial('app/templates/notes/edit.mustache', {_id: note.id}, function(html) { 
            $(html).insertAfter(target.parent().parent()).find('textarea').focus();
            context.bindSubmitOnBlurAndAutogrow();
            $('#spinner').hide(); 
          });
        });
      },
      indent: function(target){
        var context = this;  
        var target_id = context.getNoteId(target);
        var previous_id = context.getPreviousNoteId(context, target);
        var next_id = context.getNextNoteId(context, target);
        if(typeof(next_id)!="undefined"){
           context.update_object('Note', {id: next_id, previous_id: previous_id}, {}, function(note){});
        }
        context.update_object('Note', {id: target_id, previous_id: '', parent_id: previous_id}, {}, function(note){});
        target.parent().parent().wrap('<li><ul class="indent"></ul></li>');
      },
      unindent: function(target){
        
      }
    });

    bind('init', function() { with(this) {
      $(window).bind("keydown", function(e) {
        if(happenedOnNote(e)){
          var target = $(e.target);
          if (typeof(target.attr("data-text"))=="undefined") { 
            target.attr("data-text", target.val()); 
          };
          if (enterPressed(e)) {
            e.preventDefault();
            insertAndFocusNewNote(target);
            submitIfChanged(target);
          } else if(keyUpPressed(e)){
            target.parent().parent().prev().find('textarea').focus();
            submitIfChanged(target);
          } else if(keyDownPressed(e)){
            target.parent().parent().next().find('textarea').focus();
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
