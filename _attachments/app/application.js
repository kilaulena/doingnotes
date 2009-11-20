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
      // console.log('submit if changed: data-text ' + target.attr("data-text") + ' vs ' + target.val());
      if(target.attr("data-text") != target.val()) {
        target.removeAttr("data-text");
        target.parent('form').submit();
      }
    };
    
    function updateNotePointers(context, target_id, previous_id, next_id){
      if(typeof(previous_id)!="undefined"){
        //if this is not the first note, set the previous note's pointer to the note after myself
        context.update_object('Note', {id: previous_id, next_id: next_id}, {}, function(note){});
      }
      //set my next_id to null, my parent is my former previous note
      context.update_object('Note', {id: target_id, next_id: '', parent_id: previous_id}, {}, function(note){});
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
      focusPreviousTextarea: function(target){
        if (target.parent().parent().prev().find('textarea').length > 0){
          var element = target.parent().parent().prev().find('textarea');
        } else {
          var element = target.parent().parent().parent().parent().prev().find('textarea');
        }
        element.focus();
      },
      focusNextTextarea: function(target){
        if (target.parent().parent().next().find('textarea').length > 0){
          var element = target.parent().parent().next().find('textarea:first');
        } else {
          var element = target.parent().parent().parent().parent().next().find('textarea');
        }
        element.focus();
      },
      insertAndFocusNewNoteAndSubmit: function(target) { 
        var context = this;  
        var target_id = context.getNoteId(target);
        var next_id = context.getNextNoteId(context, target);
        var attributes = {text: '', outline_id: $('h2#outline-id').html()};
        if(typeof(next_id)!="undefined"){
          attributes.next_id = next_id;
        }
        context.create_object('Note', attributes, {}, function(note){ 
          context.update_object('Note', {id: target_id, next_id: note.id}, {}, function(note){
            submitIfChanged(target);
          });
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

        if(target.parent().parent().prev().children().is('ul.indent')){
          updateNotePointers(context, target_id, previous_id, next_id);
          target.parent().parent().prev().children().append(target.parent().parent());
          target.parent().parent().prev().next().find('textarea').focus();
          
        } else if(target.parent().parent().next().children().is('ul.indent')){
          updateNotePointers(context, target_id, previous_id, next_id);
          target.parent().parent().next().children().prepend(target.parent().parent());   
          target.parent().parent().next().prev().find('textarea').focus();
                 
        } else if(target.parent().parent().prev().children().is('form')) {
          updateNotePointers(context, target_id, previous_id, next_id);
          target.parent().parent().wrap('<li><ul class="indent"></ul></li>');
          target.parent().parent().find('textarea').focus();
        }
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
            insertAndFocusNewNoteAndSubmit(target);
          } else if(keyUpPressed(e)){
            focusPreviousTextarea(target);
            submitIfChanged(target);
          } else if(keyDownPressed(e)){
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
