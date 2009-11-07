var TestEnvironment = function(app) {
  this.bind('setTestEnvironment', function(e, sammy) { 
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
