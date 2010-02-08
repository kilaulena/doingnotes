ConflictResolver = function(context, couchapp) {
  this.couchapp  = couchapp;
  this.context   = context;
  this.presenter = this.presenter || new ConflictPresenter(context, couchapp);
  
}

ConflictResolver.prototype = {
  solve_conflict_by_sorting: function(parent_winner_rev_json, parent_looser_rev_json) {
    var resolver = this;
    var first_note, second_note, rev_delete, rev_keep, top_child_note, bottom_child_note;
    
    resolver.context.load_object_view('Note', parent_winner_rev_json.next_id, function(winner_parents_next_note){
      resolver.context.load_object_view('Note', parent_looser_rev_json.next_id, function(looser_parents_next_note){
        if(looser_parents_next_note.created_at() < winner_parents_next_note.created_at()){
          // the update on the looser_parents_next_note comes first
          top_child_note    = looser_parents_next_note;
          bottom_child_note = winner_parents_next_note;
          // so the winner gets deleted
          rev_delete  = parent_winner_rev_json;
          rev_keep    = parent_looser_rev_json;
        } else {
          // the update on the winner_parents_next_note comes first
          top_child_note  = winner_parents_next_note;
          bottom_child_note = looser_parents_next_note;
          // so the parent_looser_rev_json gets deleted
          rev_delete  = parent_looser_rev_json;
          rev_keep    = parent_winner_rev_json;
        }
        
        // the top_child_note's next_id must point to the bottom_child_note's id
        top_child_note.object().next_id = bottom_child_note._id();
        resolver.context.update_object('Note', {id: top_child_note._id(), next_id: bottom_child_note._id()}, {}, function(response){});

        resolver.solve_conflict_by_deletion(parent_winner_rev_json, rev_delete._rev, rev_keep._rev, {}, function(delete_response, note){
          // the parent's next_id must point to the top_child_note's id
          resolver.context.update_object('Note', {id: note._id, next_id: top_child_note._id()}, {}, function(response){
            if(parent_winner_rev_json.text != parent_looser_rev_json.text){
              var note_with_write_conflict  = note; 
              note_with_write_conflict.text = parent_looser_rev_json.text;
              note_with_write_conflict._rev = note._rev;
              //bulk post to note._id with the text this version hasn't, to create a conflict.
              resolver.couchapp.db.bulkSave({"all_or_nothing": true, "docs" : [note.to_json()]}, {
                success: function(res) {
                  if(this.context.$element().find('#conflict-warning:visible').length == 0){
                    $('#conflict-warning').slideDown('slow');
                  }
                  this.context.highlightNote(context, note._id);
                }
              });
            }
          });
        });
        
        resolver.context.flash = {message: 'Replication has automatically solved updates.', type: 'notice'};
        resolver.context.trigger('notice', this.context.flash);
        
        $('li#edit_note_' + top_child_note._id()).remove();
        $('li#edit_note_' + bottom_child_note._id()).remove();
        
        var note_element = this.context.findNoteElementById(rev_keep._id);
        var note_collection = new NoteCollection([new Note(rev_keep), top_child_note.object(), bottom_child_note.object()]);
        note_element.renderNotes(this.context, note_collection, note_collection.notes.length); 

        this.presenter.highlightNoteShort(context, top_child_note._id());
        this.presenter.highlightNoteShort(context, bottom_child_note._id());
      });
    });
  },
  
  solve_conflict_by_deletion: function(params, rev_delete, rev_keep, options, callback) {
    var resolver = this;
    resolver.context.load_object_view('Note', params._id || params.id, function(blank_object_view){
      note            = resolver.context.object_view_from_params(blank_object_view, params).object();          
      note.updated_at = new Date().toJSON();
      note.source     = resolver.context.getLocationHash();
      note._rev       = rev_keep;
      if(note.valid()) {
        resolver.couchapp.db.removeDoc({_id : note._id, _rev : rev_delete});
        resolver.couchapp.db.saveDoc(note.to_json(), {
          success: function(res) {
            if(options.message) {     
              resolver.context.flash = {message: options.message, type: 'notice'};
            }
            callback(res, note);
          }
        });
      } else {
        resolver.context.flash = {message: note.errors.join(", ")};
        resolver.context.trigger('error', context.flash);                
      };
    });
  }
};