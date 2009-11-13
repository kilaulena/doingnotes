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
    
    function enterPressed(event) {
      return (event.keyCode == 13 && event.shiftKey == false);
    };
    
    function keyUpPressed(event) {
      return (event.keyCode == 38 && event.shiftKey == false);
    };
    
    function keyDownPressed(event) {
      return (event.keyCode == 40 && event.shiftKey == false);
    };
    
    bind('init', function() { with(this) {
      $(window).bind("keydown", function(e) {
        if(e.target.tagName == 'TEXTAREA' && $(e.target).attr('class', 'expanding')){
          if (enterPressed(e)) {
            e.preventDefault();
            if($(e.target).parent().parent().attr('class') == 'edit-note') {
              Sammy.log('new note partial');
              // partial('templates/notes/new.mustache', function(html) {
              //   $(e.target).parent().parent().parent().append(html);
              //   $('textarea.expanding').autogrow();
              //   $('textarea.expanding').bind('blur', function(e) {
              //     $(e.target).parent('form').submit();
              //   });
              //   $('#spinner').hide(); 
              // });
              $(e.target).parent().parent().next().find('textarea').focus();
              $(e.target).parent('form').submit();
            } else if($(e.target).parent().parent().attr('class') == 'new-note')  {
              $(e.target).parent().parent().next().find('textarea').focus();
              $(e.target).parent('form').submit();
            }
          } else if(keyUpPressed(e)){
            Sammy.log('arrow up pressed');
            $(e.target).parent().parent().prev().find('textarea').focus();
            $(e.target).parent('form').submit();
          }  else if(keyDownPressed(e)){
            Sammy.log('arrow down pressed');
            $(e.target).parent().parent().next().find('textarea').focus();
            $(e.target).parent('form').submit();
          }
        }
         // alert('nach if');
       });
       // alert('end of init');
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
