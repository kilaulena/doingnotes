var OutlineConflictHelpers = {
  findNoteElementById: function(id ){
    return new NoteElement(this.$element().find('li#edit_note_' + id).find('textarea.expanding:first'))
  },

  highlightNote: function(context, id){
    var note_element = context.findNoteElementById(id);
    note_element.emphasizeBackground();
  },
  
  bindSolveConflictsFocus: function(){
    $('textarea.solve_text').bind('blur', function(e){
      note = new NoteElement($(e.target));
      note.unfocusTextarea();
    });
  },
    
  checkForConflicts: function(couchapp, continue_conflict_checking){
    var context = this;
    if (context.onServer()) return;
      
    performCheckForConflicts = function(){
      var outline_id = context.getOutlineId();
      
      if(outline_id){
        couchapp.design.view('notes_with_conflicts_by_outline', {
          key: outline_id,
          success: function(json) {
            if (json.rows.length > 0) {             
              var notes_with_conflicts = json.rows.map(function(row) {return row.value});
              $.each(notes_with_conflicts, function(i, note){
                context.note = note;
                var url = context.HOST + '/' + context.DB + '/' + note._id + '?rev=' + note._conflicts[0];
                $.getJSON(url, function(overwritten_note_json){
                  if(overwritten_note_json.text != context.note.text){
                    console.log('ask the user')
                    if(context.$element().find('#conflict-warning:visible').length == 0){
                      $('#conflict-warning').slideDown('slow');
                    }
                    context.highlightNote(context, overwritten_note_json._id);
                  } else if(overwritten_note_json.next_id != context.note.next_id){
                    console.log('do it automatically')
                    context.solve_conflict_by_sorting(context.note, overwritten_note_json);
                  }
                });
              });
            }
          }
        });
      }
      if(continue_conflict_checking){
        setTimeout("performCheckForConflicts()", 5000);
      }
    }
    performCheckForConflicts();
  },
  
  showConflicts: function(couchapp){
    var context = this;
    var outline_id = context.getOutlineId();

    couchapp.design.view('notes_with_conflicts_by_outline', {
       key: outline_id,
       success: function(json) {
         if (json.rows.length > 0) {
           var notes_with_conflicts = json.rows.map(function(row) {return row.value});
           $.each(notes_with_conflicts, function(i, conflicting_note_json){
             var url = context.HOST + '/' + context.DB + '/' + conflicting_note_json._id + '?rev=' + conflicting_note_json._conflicts[0];
             $.getJSON(url, function(overwritten_note_json){
               var note = context.findNoteElementById(overwritten_note_json._id);
               note.insertConflictFields(context, overwritten_note_json, conflicting_note_json);
             });
           });
         }
       }
     });
  },
  
  solve_conflict_by_sorting: function(parent_winner_rev, parent_looser_rev) {
    var context = this;
    var first_note, second_note, rev_delete, rev_keep;
    
    context.load_object_view('Note', parent_winner_rev.next_id, function(winner_parents_next_note){
      context.load_object_view('Note', parent_looser_rev.next_id, function(looser_parents_next_note){
        if(looser_parents_next_note.created_at < winner_parents_next_note.created_at){
          // the update on the looser_parents_next_note comes first
          top_child_note    = looser_parents_next_note;
          bottom_child_note = winner_parents_next_note;
          // so the winner gets deleted
          rev_delete  = parent_winner_rev._rev;
          rev_keep    = parent_looser_rev._rev;
          context.partial('app/templates/notes/edit.mustache', {_id: top_child_note._id(), text: top_child_note.text()}, function(html) {
            var bottom_note_element = context.findNoteElementById(bottom_child_note._id());
            $(html).insertBefore(bottom_note_element.note_target.closest('li'));
          });
        } else {
          // the update on the winner_parents_next_note comes first
          top_child_note  = winner_parents_next_note;
          bottom_child_note = looser_parents_next_note;
          // so the parent_looser_rev gets deleted
          rev_delete  = parent_looser_rev._rev;
          rev_keep    = parent_winner_rev._rev;
          context.partial('app/templates/notes/edit.mustache', {_id: bottom_child_note._id(), text: bottom_child_note.text()}, function(html) {
            var top_note_element = context.findNoteElementById(top_child_note._id());
            $(html).insertAfter(top_note_element.note_target.closest('li'));
          });
        }
        
        context.flash = {message: 'Replication has detected and automatically solved updates.', type: 'notice'};
        context.trigger('notice', context.flash);
        
        context.highlightNote(context, top_child_note._id());
        context.highlightNote(context, bottom_child_note._id());
                
        // the top_child_note's next_id must point to the bottom_child_note's id
        context.update_object('Note', {id: top_child_note._id(), next_id: bottom_child_note._id()}, {}, function(note){});
      
        context.solve_conflict_by_deletion(parent_winner_rev, rev_delete, rev_keep, {}, function(response, note){});
      });
    });
  },
  
  solve_conflict_by_deletion: function(params, rev_delete, rev_keep, options, callback) {
    var context = this;
    this.load_object_view('Note', params._id || params.id, function(blank_object_view){
      note = context.object_view_from_params(blank_object_view, params).object();          
      note.updated_at = new Date().toJSON();
      note._rev = rev_keep;
      // console.log('to remove: note._id =', note._id, '_rev: ', rev_delete)
      if(note.valid()) {
        couchapp.db.removeDoc({_id : note._id, _rev : rev_delete});
              
        couchapp.db.saveDoc(note.to_json(), {
          success: function(res) {
            if(options.message) {     
              context.flash = {message: options.message, type: 'notice'};
            }                         
            callback(res, object);
          }
        });
      } else {
        context.flash = {message: note.errors.join(", ")};
        context.trigger('error', context.flash);                
      };
    });
  }
}