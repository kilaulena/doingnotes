$(function() {

  var couchapp = null;
  $.CouchApp(function(app) {
    couchapp = app;
  });
  // var content = $('#content');

  var sammy = $.sammy(function() { with(this) {
    element_selector = '#content';
    use(Sammy.Mustache);
    use(Resources, couchapp);
    flash = {};

    Notes(this);

    before(function() {
      $('#flash').html(flash.message);
      $('#flash').attr('class', flash.type);
      flash = {type: '', message: ''};
      $('#spinner').show();
    });
    
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
                  if($(e.target).attr('id') != 'new-text') {
                   console.log('new note partial');
                   $(e.target).parent().parent().next().find('textarea').focus();
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
       });
     }});
 
     bind('error', function(e, message) { with(this) {
       flash = {type : 'error', message: message};
     }});
 
     bind('notice', function(e, message) { with(this) {
       flash = {type : 'notice', message: message};
     }});
  }});

  sammy.run('#/notes/write');
  sammy.trigger('init');
  
  // without this hack cucumber/culerity doesn't recognize the changed hash
  $('a').live('click', function() {
    var hash = $(this).attr('href').match(/#.+/)[0];
    if(hash) {
      sammy.runRoute('get', hash);
      // window.location.href = hash;
    };
    return false;
  });
});
