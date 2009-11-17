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
      insertAndFocusNewNote: function(target) { 
        var context = this;  
        this.create_object('Note', {text: '', outline_id: $('h2#outline-id').html()}, {}, function(note){      
          context.partial('app/templates/notes/edit.mustache', {_id: note.id}, function(html) { 
            $(html).insertAfter(target.parent().parent()).find('textarea').focus();
            context.bindSubmitOnBlurAndAutogrow();
            // $.scrollTo($('#new-note'));
            $('#spinner').hide(); 
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
        if(happenedOnNote(e)){
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
