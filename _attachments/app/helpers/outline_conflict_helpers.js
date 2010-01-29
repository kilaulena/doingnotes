var OutlineConflictHelpers = {
  findNoteElementById: function(id ){
    return new NoteElement(this.$element().find('li#edit_note_' + id).find('textarea.expanding:first'))
  },

  highlightNoteShort: function(context, id){
    var note_element = context.findNoteElementById(id);
    note_element.emphasizeBackground(true);
  },
  
  highlightNote: function(context, id){
    var note_element = context.findNoteElementById(id);
    note_element.emphasizeBackground(false);
  },
  
  bindSolveConflictsFocus: function(){
    $('textarea.solve_text').bind('blur', function(e){
      note = new NoteElement($(e.target));
      note.unfocusTextarea();
    });
  },
    
  checkForConflicts: function(couchapp, continue_conflict_checking){
    if (this.onServer()) return;
    var context    = this;
    var outline_id = context.getOutlineId();
    var url        = context.HOST + '/' + context.DB + 
                     '/_changes?filter=doingnotes/conflicted' +
                     '&feed=continuous&heartbeat=5000';  //30000  
    var solved_ids = [];
    
    if(outline_id){ 
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange=function() {
        if(xmlhttp.readyState==3){
          if(xmlhttp.responseText.match(/changes/)){
            var lines = xmlhttp.responseText.split("\n");
            if(lines[lines.length-2].length != 0){ 
              lines = lines.remove("");
              console.log('Conflicts here: \n', lines)
              $.each(lines, function(i, line){  
                var json = JSON.parse(line);
                if(!solved_ids.contains(json.id)){
                  solved_ids.push(json.id);
                  var url_note = context.HOST + '/' + context.DB + '/' + json.id + '?conflicts=true';
                  $.getJSON(url_note, function(note_json){
                    var url_overwritten_note = context.HOST + '/' + context.DB + '/' + json.id + '?rev=' + note_json._conflicts[0];
                    $.getJSON(url_overwritten_note, function(overwritten_note_json){
                      if(overwritten_note_json.next_id != note_json.next_id){
                        console.log('append conflict - do it automatically')
                        context.solve_conflict_by_sorting(couchapp, note_json, overwritten_note_json);
                      } else if(overwritten_note_json.text != note_json.text){
                        console.log('write conflict - ask the user')
                        if(context.$element().find('#conflict-warning:visible').length == 0){
                          $('#conflict-warning').slideDown('slow');
                        }
                        context.highlightNote(context, overwritten_note_json._id);
                      }
                    });
                  });
                }
              });
            }
          }
          if(xmlhttp.responseText.match(/last_seq/)){
            console.log('Timeout in checkForConflicts:', xmlhttp.responseText)
          }
        }
      }
      xmlhttp.open("GET", url, true);
      xmlhttp.send(null);
    }
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
               var note_element = context.findNoteElementById(overwritten_note_json._id);
               note_element.insertConflictFields(context, overwritten_note_json, conflicting_note_json);
             });
           });
         }
       }
     });
  },
  
  solve_conflict_by_sorting: function(couchapp, parent_winner_rev_json, parent_looser_rev_json) {
    var context = this;
    var first_note, second_note, rev_delete, rev_keep, top_child_note, bottom_child_note;
    context.load_object_view('Note', parent_winner_rev_json.next_id, function(winner_parents_next_note){
      context.load_object_view('Note', parent_looser_rev_json.next_id, function(looser_parents_next_note){
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
        context.update_object('Note', {id: top_child_note._id(), next_id: bottom_child_note._id(), source: context.getLocationHash()}, {}, function(response){});

        context.solve_conflict_by_deletion(couchapp, parent_winner_rev_json, rev_delete._rev, rev_keep._rev, {}, function(delete_response, note){
          // the parent's next_id must point to the top_child_note's id
          context.update_object('Note', {id: note._id, next_id: top_child_note._id(), source: context.getLocationHash()}, {}, function(response){
            if(parent_winner_rev_json.text != parent_looser_rev_json.text){
              var note_with_write_conflict  = note; 
              note_with_write_conflict.text = parent_looser_rev_json.text;
              note_with_write_conflict._rev = note._rev;
              //bulk post to note._id with the text this version hasn't, to create a conflict.
              couchapp.db.bulkSave({"all_or_nothing": true, "docs" : [note.to_json()]}, {
                success: function(res) {
                  if(context.$element().find('#conflict-warning:visible').length == 0){
                    $('#conflict-warning').slideDown('slow');
                  }
                  context.highlightNote(context, note._id);
                }
              });
            }
          });
        });
        
        context.flash = {message: 'Replication has automatically solved updates.', type: 'notice'};
        context.trigger('notice', context.flash);
        
        $('li#edit_note_' + top_child_note._id()).remove();
        $('li#edit_note_' + bottom_child_note._id()).remove();
        
        var note_element = context.findNoteElementById(rev_keep._id);
        var note_collection = new NoteCollection([new Note(rev_keep), top_child_note.object(), bottom_child_note.object()]);
        note_element.renderNotes(context, note_collection, note_collection.notes.length); 

        context.highlightNoteShort(context, top_child_note._id());
        context.highlightNoteShort(context, bottom_child_note._id());
      });
    });
  },
  
  solve_conflict_by_deletion: function(couchapp, params, rev_delete, rev_keep, options, callback) {
    var context = this;
    this.load_object_view('Note', params._id || params.id, function(blank_object_view){
      note            = context.object_view_from_params(blank_object_view, params).object();          
      note.updated_at = new Date().toJSON();
      note.source     = context.getLocationHash();
      note._rev       = rev_keep;
      // console.log('to remove: note._id =', note._id, '_rev: ', rev_delete, 'source:', note.source)
      // console.log('to keep: note._id =', note._id, '_rev: ', rev_keep, 'source:', note.source)
      if(note.valid()) {
        couchapp.db.removeDoc({_id : note._id, _rev : rev_delete});
        couchapp.db.saveDoc(note.to_json(), {
          success: function(res) {
            if(options.message) {     
              context.flash = {message: options.message, type: 'notice'};
            }
            callback(res, note);
          }
        });
        
      } else {
        context.flash = {message: note.errors.join(", ")};
        context.trigger('error', context.flash);                
      };
    });
  }
}