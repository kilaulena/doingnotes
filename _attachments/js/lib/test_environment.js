var TestEnvironment = function(app, sammy) {
  this.bind('setTestEnvironment', function(e, sammy) { 
    alert('set test env');
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
