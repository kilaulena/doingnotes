ConflictResolver = function(context, couchapp) {
    this.couchapp   = couchapp;
    this.context    = context;
    this.solved_note_ids = [];
}

ConflictResolver.prototype = {
  checkForNewConflicts: function(){
    if (this.context.onServer()) return;
    var resolver   = this;
    var url        = this.context.HOST + '/' + this.context.DB + 
                     '/_changes?filter=doingnotes/conflicted' +
                     '&feed=continuous&heartbeat=5000';
    
    if(resolver.context.getOutlineId()){ 
      resolver.listenForConflicts(url, function(responseText){
        resolver.examineResponseText(responseText, function(json){
          resolver.getFirstConflictingRevisionOfNote(json, function(overwritten_note_json, note_json){
            resolver.showAppropriateConflictWarning(overwritten_note_json, note_json);
          });
        });
      });
    }
  },
  
  listenForConflicts: function(url, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
      if(xmlhttp.readyState==3){
        callback(xmlhttp.responseText);
      }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
  },
  
  examineResponseText: function(responseText, callback){
    var resolver = this;
    if(responseText.match(/changes/)){
      var lines = responseText.split("\n");
      if(lines[lines.length-2].length != 0){ 
        lines = lines.remove("");
        $.each(lines, function(i, line){  
          var json = JSON.parse(line);
          resolver.couchapp.db.openDoc(json.id, {
            success: function(doc) {
              if(resolver.context.getOutlineId() == doc.outline_id){
                Sammy.log('Conflicts here: \n', lines);   
                callback(json);
              }
            }
          });
        });
      }
    }
    if(responseText.match(/last_seq/)){
      Sammy.log('Timeout in checkForConflicts:', responseText)
    }
  },
  
  getFirstConflictingRevisionOfNote: function(json, callback){
    var resolver = this;
    if(!resolver.solved_note_ids.contains(json.id)){
      resolver.solved_note_ids.push(json.id);
      var url_note = resolver.context.HOST + '/' + resolver.context.DB + '/' + json.id + '?conflicts=true';
      $.getJSON(url_note, function(note_json){
        var url_overwritten_note = resolver.context.HOST + '/' + resolver.context.DB + '/' + json.id + '?rev=' + note_json._conflicts[0];
        $.getJSON(url_overwritten_note, function(overwritten_note_json){
          callback(overwritten_note_json, note_json);
        });
      });
    }
  },
  
  showAppropriateConflictWarning: function(overwritten_note_json, note_json){
    if(overwritten_note_json.next_id != note_json.next_id){
      Sammy.log('append conflict - do it automatically')
      this.solve_conflict_by_sorting(note_json, overwritten_note_json);
    } else if(overwritten_note_json.text != note_json.text){
      Sammy.log('write conflict - ask the user')
      this.context.showWriteConflictWarning(context);
      this.context.highlightNote(context, overwritten_note_json._id);
      this.markNoteAsWriteConflicted(overwritten_note_json._id); //TODO
    }
  },
  
  showConflicts: function(){
    this.couchapp.design.view('notes_with_conflicts_by_outline', {
       key: this.context.getOutlineId(),
       success: function(json) {
         if (json.rows.length > 0) {
           var notes_with_conflicts = json.rows.map(function(row) {return row.value});
           $.each(notes_with_conflicts, function(i, conflicting_note_json){
             var url = this.context.HOST + '/' + this.context.DB + '/' + conflicting_note_json._id + '?rev=' + conflicting_note_json._conflicts[0];
             $.getJSON(url, function(overwritten_note_json){
               var note_element = this.context.findNoteElementById(overwritten_note_json._id);
               note_element.insertConflictFields(this.context, overwritten_note_json, conflicting_note_json);
             });
           });
         }
       }
     });
  },
  
  
  markNoteAsWriteConflicted: function(id){
    console.log('markNoteAsWriteConflicted')
    // TODO
    // irgendwo in diesem objekt ein array mit allen note ids die write conflict haben speichern
    // was dann in der outline persistiert wird. aber wann? als callback von dem checkForNewConflicts?
    
    // load_object_view('Outline', params['id'], function(outline_view){
    //   partial('app/templates/outlines/edit.mustache', outline_view, function(outline_view){
    //     app.swap(outline_view);
    //     $('#spinner').hide(); 
    //   });
    // });
    // context.update_object('Outline', {id: context.getOutlineId(), write_conflict: true}, 
    //   {success: function(obj){console.log('success', obj)}}, 
    //   function(outline){
    //     console.log('updated. and outline is: ', outline)
    //   }
    // );
  },
  
  solve_conflict_by_sorting: function(parent_winner_rev_json, parent_looser_rev_json) {
    var first_note, second_note, rev_delete, rev_keep, top_child_note, bottom_child_note;
    this.context.load_object_view('Note', parent_winner_rev_json.next_id, function(winner_parents_next_note){
      this.context.load_object_view('Note', parent_looser_rev_json.next_id, function(looser_parents_next_note){
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
        this.context.update_object('Note', {id: top_child_note._id(), next_id: bottom_child_note._id()}, {}, function(response){});

        solve_conflict_by_deletion(parent_winner_rev_json, rev_delete._rev, rev_keep._rev, {}, function(delete_response, note){
          // the parent's next_id must point to the top_child_note's id
          this.context.update_object('Note', {id: note._id, next_id: top_child_note._id()}, {}, function(response){
            if(parent_winner_rev_json.text != parent_looser_rev_json.text){
              var note_with_write_conflict  = note; 
              note_with_write_conflict.text = parent_looser_rev_json.text;
              note_with_write_conflict._rev = note._rev;
              //bulk post to note._id with the text this version hasn't, to create a conflict.
              couchapp.db.bulkSave({"all_or_nothing": true, "docs" : [note.to_json()]}, {
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
        
        this.context.flash = {message: 'Replication has automatically solved updates.', type: 'notice'};
        this.context.trigger('notice', this.context.flash);
        
        $('li#edit_note_' + top_child_note._id()).remove();
        $('li#edit_note_' + bottom_child_note._id()).remove();
        
        var note_element = this.context.findNoteElementById(rev_keep._id);
        var note_collection = new NoteCollection([new Note(rev_keep), top_child_note.object(), bottom_child_note.object()]);
        note_element.renderNotes(this.context, note_collection, note_collection.notes.length); 

        this.context.highlightNoteShort(context, top_child_note._id());
        this.context.highlightNoteShort(context, bottom_child_note._id());
      });
    });
  },
  
  solve_conflict_by_deletion: function(params, rev_delete, rev_keep, options, callback) {
    this.context.load_object_view('Note', params._id || params.id, function(blank_object_view){
      note            = this.context.object_view_from_params(blank_object_view, params).object();          
      note.updated_at = new Date().toJSON();
      note.source     = this.context.getLocationHash();
      note._rev       = rev_keep;
      if(note.valid()) {
        this.couchapp.db.removeDoc({_id : note._id, _rev : rev_delete});
        this.couchapp.db.saveDoc(note.to_json(), {
          success: function(res) {
            if(options.message) {     
              this.context.flash = {message: options.message, type: 'notice'};
            }
            callback(res, note);
          }
        });
        
      } else {
        this. context.flash = {message: note.errors.join(", ")};
        this. context.trigger('error', context.flash);                
      };
    });
  }
};