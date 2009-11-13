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
    
    function editNoteClicked(event){
      return (happenedOnNote(event) && $(event.target).parent().parent().attr('class') == 'edit-note');
    };
    
    function newNoteClicked(event){
      return (happenedOnNote(event) && $(event.target).parent().parent().attr('class') == 'new-note');
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
    
    function isLastEditNote(event) {
      return (!$(event.target).parent().parent().next('edit-note'));
    };
    
    function submitIfChanged(target) {
      if(target.attr("data-text") != target.val()) {
        target.removeAttr("data-text");
        target.parent('form').submit();
      }
    };
    
    this.helpers({
      bindSubmitOnBlurAndAutogrow: function(){
        console.log('bindSubmitOnBlurAndAutogrow');
        $('textarea.expanding').autogrow();
        $('textarea.expanding').bind('blur', function(e) {
          submitIfChanged($(e.target));
        });
      },
      appendNewNote: function(target) {       
        this.partial('app/templates/notes/new.mustache', {outline_id: $('h2#outline-id').html()}, function(html) {
          $(html).appendTo(target.parent().parent().parent()).find('textarea').focus();
          $('textarea.expanding').autogrow();
          $('textarea.expanding').bind('blur', function(e) {
            submitIfChanged(target);
          });         
        });
      },
      insertEditNote: function(target){
        this.partial('app/templates/notes/edit.mustache', {_id: 'temp-edit', text: target.val()}, function(html) {
          $(html).prependTo(target.parent().parent().parent()).find('textarea').focus();
          $('textarea.expanding').autogrow();
          $('textarea.expanding').bind('blur', function(e) {
            submitIfChanged(target);
          });         
        });        
      }
    });

    bind('init', function() { with(this) {
      $(window).bind("keydown", function(e) {
        var target = $(e.target);
        if (!target.attr("data-text")) { 
          target.attr("data-text", target.val()); 
        };
        if(newNoteClicked(e)){
          if (enterPressed(e)) {
            e.preventDefault();            
            insertEditNote(target);
            target.parent().parent().next('new-note').find('textarea').focus();
            submitIfChanged(target);
          } else if(keyUpPressed(e)){
            target.parent().parent().prev().find('textarea').focus();
            $('#new-note').before(target.html());
            $('#new-note').remove();
            submitIfChanged(target);
          } else if(keyDownPressed(e)){
            target.parent().parent().next().find('textarea').focus();
            submitIfChanged(target);
          }
        } else if(editNoteClicked(e)){
          if (enterPressed(e)) {
            e.preventDefault();
            appendNewNote(target);
            submitIfChanged(target);
          } else if(keyUpPressed(e)){
            target.parent().parent().prev().find('textarea').focus();
            submitIfChanged(target);
          }  else if(keyDownPressed(e)){
            if (isLastEditNote(e)) {
              submitIfChanged(target);
            } else {
              target.parent().parent().next().find('textarea').focus();
              submitIfChanged(target);
            }
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
