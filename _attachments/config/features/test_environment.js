function setTestEnv(){
  sammy.use(TestEnvironment);
  sammy.helpers(TestConfig);
  sammy.trigger('setTestEnvironment');
};

var TestConfig = {
  DB:     "doingnotes_test",
  SERVER: "http://localhost:5985",
  HOST:   "http://localhost:5984",
  ENV:    "test", 
}

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
