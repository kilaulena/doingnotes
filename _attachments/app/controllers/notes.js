Notes = function(sammy, couchapp) { with(sammy) {
  put('#/notes/solve/:id', function() {
    var context = this;
    var rev_delete = context.params.rev_delete;
    var rev_keep   = context.params.rev_keep;
    delete(context.params.rev_delete);
    delete(context.params.rev_keep);
    var conflictResolver = new ConflictResolver(context, couchapp);
    conflictResolver.solve_conflict_by_deletion(context.params, rev_delete, rev_keep, {message: 'Conflict solved.'}, function(response, note){
      if($('div.solve_text:visible').size() > 1){
        var note_element = context.findNoteElementById(note._id);
        note_element.replaceConflictFields(context, note);
        $('#spinner').hide(); 
      } else {
        context.redirect('#/outlines/' + note.outline_id, context.flash);
      }
    });
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