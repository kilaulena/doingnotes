Notes = function(sammy, couchapp) { with(sammy) {
  put('#/notes/solve/:id', function() {
    var notesView = new NotesView(this, couchapp);
    notesView.solveNoteConflict(this.params);
    return false;
  });
  
  put('#/notes/:id', function()  { with(this) {
    params.source = getLocationHash();
    update_object('Note', params, {}, function(note){
      $('#spinner').hide(); 
    });
    return false;
  }});
}};