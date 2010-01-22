Notes = function(sammy) { with(sammy) {
  put('#/notes/solve/:id', function() { with(this){ 
    var rev_delete = params.rev_delete;
    var rev_keep   = params.rev_keep;
    delete(params.rev_delete);
    delete(params.rev_keep);
    solve_conflict_by_deletion(params, rev_delete, rev_keep, {message: 'Conflict solved.'}, function(response, note){
      redirect('#/outlines/' + note.outline_id, flash);
    });
    return false;
  }});
  
  put('#/notes/:id', function()  { with(this) {
    params.source = getLocationHash();
    update_object('Note', params, {}, function(note){
      $('#spinner').hide(); 
    });
    return false;
  }});
}};