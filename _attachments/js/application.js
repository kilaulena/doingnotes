// console = console || { log:function(){} };

$(function() {
  var couchapp = null;
  $.CouchApp(function(app) {
    couchapp = app;
  });

  sammy = new Sammy.Application(function() { with(this) {
    element_selector = '#content';
    use(Sammy.Mustache);
    use(Resources, couchapp);
    use(TestEnvironment, this);
    flash = {};
    Notes(this);
    
    get('#/', function(){with(this) {
      redirect('#/notes/write');
      return false;
    }});
    
    bind('init', function() { with(this) {
      $(window).bind("keydown", function(e) {
         if(e.target.tagName == 'TEXTAREA' && $(e.target).attr('class', 'expanding')){
           var ENTER = 13;
           var UP = 38;
           var DOWN = 40;
           if (e.keyCode == ENTER || e.keyCode == UP || e.keyCode == DOWN) {
             e.preventDefault();
             switch(e.keyCode) {
               case ENTER:
                  if($(e.target).parent().parent().attr('class') == 'edit-note') {
                   // console.log('new note partial');
                   // partial('templates/notes/new.mustache', function(html) {
                   //   $(e.target).parent().parent().parent().append(html);
                   //   $('textarea.expanding').autogrow();
                   //   $('textarea.expanding').bind('blur', function(e) {
                   //     $(e.target).parent('form').submit();
                   //   });
                   //   $('#spinner').hide(); 
                   // });
                   $(e.target).parent().parent().next().find('textarea').focus();
                  } else { 
                  }
                 break;
               case UP:
                 console.log('arrow up pressed');
                 $(e.target).parent().parent().prev().find('textarea').focus();
                 break;
               case DOWN:
                 console.log('arrow down pressed');
                 $(e.target).parent().parent().next().find('textarea').focus();
                 break;
             }
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
    }});

    bind('notice', function(e, flash) { with(this) {
      $('#flash').html(flash.message);
      $('#flash').attr('class', 'notice');
    }});
  }});


  sammy.run('#/');
  sammy.trigger('init');
});

function setTestEnv(){
  (function(){
    sammy.trigger('setTestEnvironment');
  })();
};
