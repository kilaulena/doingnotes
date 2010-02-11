NotesView = function(context, couchapp) {
  nv = this;
  nv.context  = context;
  nv.couchapp = couchapp;
}

NotesView.prototype = {
  solveNoteConflict: function(params){
    var rev_delete = params.rev_delete;
    var rev_keep   = params.rev_keep;
    delete(params.rev_delete);
    delete(params.rev_keep);
    var conflictResolver = new ConflictResolver(nv.context, nv.couchapp);
    conflictResolver.solve_conflict_by_deletion(params, rev_delete, rev_keep, {message: 'Conflict solved.'}, function(response, note){
      if($('div.solve_text:visible').size() > 1){
        var note_element = nv.context.findNoteElementById(note._id);
        note_element.replaceConflictFields(nv.context, note);
        $('#spinner').hide(); 
      } else {
        nv.context.redirect('#/outlines/' + note.outline_id, nv.context.flash);
      }
    });
  }
}