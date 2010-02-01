function setTestEnv(){
  sammy.use(TestEnvironment);
  sammy.trigger('setTestEnvironment');
};

var TestEnvironment = function(app) {
  this.bind('setTestEnvironment', function(e) { 
    // without this hack cucumber/culerity doesn't recognize the changed hash
    $('a').live('click', function() {
      var hash = $(this).attr('href').match(/#.+/)[0];
      if(hash) {
        app.runRoute('get', hash);
      };
      return false;
    });
  });
};
