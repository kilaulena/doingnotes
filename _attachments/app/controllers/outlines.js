Outlines = function(sammy, couchapp) { with(sammy) {
  get('#/outlines', function() { with(this) {
    list_objects('Outline', 'outlines', [], function(view){  
      render('index', view);
      $('#spinner').hide(); 
    });
    return false;
  }});

  get('#/outlines/new', function() { with(this) {
    new_object('outline', function(outline){  
      render('new', outline);
      $('#spinner').hide(); 
    });
    return false;
  }});

  get('#/outlines/:id', function() { with(this) {
    var view = {};
    var context = this;
    couchapp.design.view('notes_by_outline', {
      startkey: [params['id']],
      endkey: [params['id'], {}],
      success: function(json) {
        if(json.rows[0]) {
          view.title = json.rows[0].value.title;
          view.id    = json.rows[0].value._id;
          json.rows.splice(0,1);        
          if (json['rows'].length > 0) {   
            notes = json['rows'].map(function(row) {return new Note(row.value)}); 
            view.notes = [(new NoteCollection(notes)).firstNote()];
            renderOutline(context, view, (new NoteCollection(notes)));
          } else {
            create_object('Note', {outline_id: view.id, first_note: true, text:''}, {}, function(note){
              view.notes = [note];
              renderOutline(context, view, (new NoteCollection([])));
            })            
          } 
        } else {
          flash = {message: 'Outline does not exist.', type: 'error'};
          redirect('#/outlines', flash);
        }      
      }
    });
    return false;
  }});
  
  post('#/outlines', function() { with(this) {
    create_object('Outline', params, {message: "Here is your new outline"}, function(outline){
      redirect('#/outlines/' + outline._id, flash);
    });
    return false;
  }});
  
  put('#/outlines/:id', function()  { with(this) {   
    update_object('Outline', params, {}, function(outline){
      $('#spinner').hide(); 
    });
    return false;
  }});

  route('delete', '#/outlines/:id', function() { with(this) {
    delete_object(params, {message: 'Outline deleted.'}, function(outline){
      redirect('#/outlines', flash);
    });
    return false;
  }});
}};