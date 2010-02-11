ConflictResolver = function(context, couchapp) {
  this.couchapp  = couchapp;
  this.context   = context;
  this.presenter = this.presenter || new ConflictPresenter(context, couchapp);
}

ConflictResolver.prototype = {
  solve_conflict_by_sorting: function(parent_winner_rev_json, parent_looser_rev_json) {
    var rs = this;
    var first_note, second_note, rev_delete, rev_keep, top_child_note, bottom_child_note;
    
    rs.context.load_object_view('Note', parent_winner_rev_json.next_id, function(winner_parents_next_note){
      rs.context.load_object_view('Note', parent_looser_rev_json.next_id, function(looser_parents_next_note){
        if(looser_parents_next_note.created_at() < winner_parents_next_note.created_at()){
          // the update on the looser_parents_next_note comes first
          top_child_note    = looser_parents_next_note;
          bottom_child_note = winner_parents_next_note;
          // so the winner gets deleted
          rev_delete = parent_winner_rev_json;
          rev_keep   = parent_looser_rev_json;
        } else {
          // the update on the winner_parents_next_note comes first
          top_child_note  = winner_parents_next_note;
          bottom_child_note = looser_parents_next_note;
          // so the parent_looser_rev_json gets deleted
          rev_delete = parent_looser_rev_json;
          rev_keep   = parent_winner_rev_json;
        }
        rs.setTopChildNoteNextIdToBottomChildNote(top_child_note, bottom_child_note);
        
        rs.solve_conflict_by_deletion(parent_winner_rev_json, rev_delete._rev, rev_keep._rev, {}, function(delete_response, note){
          rs.setParentsNextPointerToTopChildNote(note, top_child_note, parent_winner_rev_json, parent_looser_rev_json);
        });  
        
        rs.context.flash = {message: 'Replication has automatically solved updates.', type: 'notice'};
        rs.context.trigger('notice', this.context.flash);

        rs.showAndHighlightResolvedNotes(top_child_note, bottom_child_note, rev_keep);
      });
    });
  },
  
  setTopChildNoteNextIdToBottomChildNote: function(top_child_note, bottom_child_note){
    var rs = this;
    top_child_note.object().next_id = bottom_child_note._id();
    rs.context.update_object('Note', {
        id: top_child_note._id(), next_id: bottom_child_note._id()
      }, {}, function(response){}
    );
  },
  
  setParentsNextPointerToTopChildNote: function(note, top_child_note, parent_winner_rev_json, parent_looser_rev_json){
    var rs = this;
    rs.context.update_object('Note', {id: note._id, next_id: top_child_note._id()}, {}, function(response){
      if(parent_winner_rev_json.text != parent_looser_rev_json.text){
        rs.recreateWriteConflict(note, parent_looser_rev_json);
      }
    });
  },
  
  recreateWriteConflict: function(note, parent_looser_rev_json){
    var rs = this;
    var note_with_write_conflict  = note; 
    note_with_write_conflict.text = parent_looser_rev_json.text;
    //bulk post to note._id with the text this version hasn't, to recreate the write conflict.
    rs.couchapp.db.bulkSave({"all_or_nothing": true, "docs" : [note_with_write_conflict.to_json()]}, {
     success: function(res) {
       console.log('conflict created')
       rs.presenter.showWriteConflictWarning(note._id);
     }
    });
  },
    
  showAndHighlightResolvedNotes: function(top_child_note, bottom_child_note, rev_keep){
    $('li#edit_note_' + top_child_note._id()).remove();
    $('li#edit_note_' + bottom_child_note._id()).remove();
    
    var note_element = this.context.findNoteElementById(rev_keep._id);
    var note_collection = new NoteCollection([new Note(rev_keep), top_child_note.object(), bottom_child_note.object()]);
    note_element.renderNotes(this.context, note_collection, note_collection.notes.length); 
  
    this.presenter.highlightNoteOkay(top_child_note._id());
    this.presenter.highlightNoteOkay(bottom_child_note._id());
  },
  
  
  
  
  solve_conflict_by_deletion: function(params, rev_delete, rev_keep, options, callback) {
    var rs = this;
    rs.context.load_object_view('Note', params._id || params.id, function(blank_object_view){
      rs.prepareNoteWithNewRevision(blank_object_view, params, rev_keep, function(note){
        rs.deleteOldRevisionAndSaveNew(note, rev_delete, options, callback);
      });
    });
  },
  
  prepareNoteWithNewRevision: function(blank_object_view, params, rev_keep, callback){
    var note = this.context.object_view_from_params(blank_object_view, params).object();
    note.updated_at = new Date().toJSON();
    note.source     = this.context.getLocationHash();
    note._rev       = rev_keep;
    if(note.valid()) {
      callback(note);
    } else {
      this.context.flash = {message: note.errors.join(", ")};
      this.context.trigger('error', context.flash);
    };
  }, 
  
  deleteOldRevisionAndSaveNew: function(note, rev_delete, options, callback){
    var rs = this;
    rs.couchapp.db.removeDoc({_id : note._id, _rev : rev_delete});
    rs.couchapp.db.saveDoc(note.to_json(), {
      success: function(res) {
        if(options.message) {     
          rs.context.flash = {message: options.message, type: 'notice'};
        }
        callback(res, note);
      }
    });
  }
};
