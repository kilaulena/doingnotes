Outlines = function(sammy, couchapp) { with(sammy) {  
  get('#/outlines', function() { with(this) {
    var outlinesView = new OutlinesView(this, couchapp);
    outlinesView.listOutlines();
    return false;
  }});

  get('#/outlines/new', function() { with(this) {
    new_object('outline', function(outline){  
      render('new', outline);
      $('#spinner').hide(); 
    });
    return false;
  }});

  get('#/outlines/:id', function() {
    var outlinesView = new OutlinesView(this, couchapp);
    outlinesView.showOutline(this.params);
    return false;
  });
  
  get('#/outlines/edit/:id', function(){
    var context = this;
    context.load_object_view('Outline', context.params.id, function(outline_view){
      context.partial('app/templates/outlines/edit.mustache', outline_view, function(outline_view){
        context.app.swap(outline_view);
        $('#spinner').hide(); 
      });
    });
    return false;
  });
  
  post('#/outlines', function(){ with(this){
    create_object('Outline', params, {message: "Here is your new outline"}, function(outline){
      redirect('#/outlines/' + outline._id, flash);
    });
    return false;
  }});
  
  put('#/outlines/:id', function(){ with(this) {    
    update_object('Outline', params, {}, function(outline){
      trigger('notice', {message: 'Title successfully changed'});
      $('#spinner').hide(); 
    });
    return false;
  }});

  route('delete', '#/outlines/:id', function() {
    var outlinesView = new OutlinesView(this, couchapp);
    outlinesView.deleteOutlineWithNotes(this.params);
    return false;
  });
}};