Notes = function(sammy) { with(sammy) {
  get('#/notes', function() { with(this) {
    redirect('#/notes/byDate');
    return false;
  }});
  
  get(/^#\/notes\/(byText|byDate)$/, function() { with(this) {
    var options = [];
    options['sort'] = params.splat[0];
    list_objects('Note', 'notes', options, function(notes){  
      render('index', notes);
      $('#spinner').hide(); 
    });
    return false;
  }});


  get('#/notes/:id', function() { with(this) {
    load_object('Note', params['id'], function(note_view){
      render('show', note_view);
      $('#spinner').hide(); 
    });
    return false;
  }});
  
  post('#/notes', function() { with(this) {
    $('#new-note form textarea#new-text').attr('value','');
    create_object('Note', params, {}, function(note){
      partial('app/templates/notes/edit.mustache', {_id: note.id, text: params['text']}, function(html) {
        $('#new-note').before(html);
        $('textarea.expanding').autogrow();
        // $.scrollTo($('#new-note'));
        $('#spinner').hide(); 
      });
    });
    return false;
  }});
  
  put('#/notes/:id', function()  { with(this) {   
    update_object('Note', params, {}, function(note){
      $('#spinner').hide(); 
    });
    return false;
  }});

  route('delete', '#/notes/:id', function() { with(this) {
    delete_object(params, {message: 'Note deleted.'}, function(note){
      redirect('#/notes/byDate', flash);
    });
    return false;
  }});
}};