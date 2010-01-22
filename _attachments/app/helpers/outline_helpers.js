var OutlineHelpers = {
  bindSubmitOnBlurAndAutogrow: function(){
    $('textarea.expanding').autogrow();
    $('textarea.expanding').bind('blur', function(e){
      var note = new NoteElement($(e.target));
      note.setDataText();
      note.unfocusTextarea();
      note.submitIfChanged();
    });
    $("a.image").bind("click", function(){
      $(this).parent().next('ul.indent').toggle();
      $(this).toggleClass('down');
      return false;
    });
  },
  
  unbindSubmitOnBlurAndAutogrow: function(){
    $('textarea.expanding').unbind('blur');
    $('textarea.expanding').unbind('focus');
    $('a.image').unbind('click');		
  },
  
  bindSolveConflictsFocus: function(){
    $('textarea.solve_text').bind('blur', function(e){
      note = new NoteElement($(e.target));
      note.unfocusTextarea();
    });
  },
  
  getOutlineId: function(){
    if((this.$element().find('h2#outline-id')).length != 0){
      return this.$element().find('h2#outline-id').html();
    }
  },
  
  findNoteElementById: function(id ){
    return new NoteElement(this.$element().find('li#edit_note_' + id).find('textarea.expanding:first'))
  },
  
  getLocationHash: function(){
    return hex_md5(window.location.host);
  },
  
  getEtagFromXHR: function(xhr){
    return xhr.getResponseHeader('ETag').replace(/^"+/,'').replace(/"+$/,'');
  },
  
  displayAndHideFlash: function(flash){
    $('#flash').attr('class', flash.type);
    $('#flash').html(flash.message);
    $('#flash').show();
    $('#spinner').hide();    
    setTimeout("$('#flash').fadeOut('slow')", 5000);
  },
  
  renderOutline: function(context, view, notes, couchapp, solve){
    context.render('show', view, function(response){
      context.app.swap(response);
      var first_note = new NoteElement($('ul#notes li:first').find('textarea.expanding'));
      if(notes.notes.length > 1) {
        first_note.renderNotes(context, notes, notes.notes.length); 
      }
      first_note.focusTextarea();
      context.checkForUpdates(couchapp);
      var continue_conflict_checking = true;
      if(solve){
        continue_conflict_checking = false;
        context.showConflicts(couchapp);
      } else {
        context.checkForConflicts(couchapp, continue_conflict_checking);
      }
      $('#spinner').hide(); 
    });
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
  
  highlightNote: function(context, id){
    var note_element = context.findNoteElementById(id);
    note_element.emphasizeBackground();
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
        setTimeout("performCheckForConflicts()", 7000);
      }
    }
    performCheckForConflicts();
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
      
        context.solve_conflict_by_deletion('Note', parent_winner_rev, rev_delete, rev_keep, {}, function(response, note){});
      });
    });
  },
  
  
  checkForUpdates: function(couchapp){
    var context    = this;
    var outline_id = context.getOutlineId();
    var source     = context.getLocationHash();
    var url        = context.HOST + '/' + context.DB + 
                     '/_changes?filter=doingnotes/changed' +
                     '&source=' + source;    
    
    if(outline_id){ 
      $.getJSON(url, function(json){
        var since = json.last_seq;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
          if(xmlhttp.readyState==3){
            console.log('checkForUpdates says this has changed in another application:')
            console.log(xmlhttp.responseText)
            if (xmlhttp.responseText.length > 0){
              if(context.$element().find('#change-warning:visible').length == 0){
                $('#change-warning').slideDown('slow');
              }
            }
          }
        }
        xmlhttp.open("GET", url + '&feed=continuous&since=' + since, true);
        xmlhttp.send(null);
      });
    }
  },

  replicateUp: function(){
    var context = this;   
    $.post(context.HOST + '/_replicate', 
      '{"source":"' + context.DB + '", "target":"' + context.SERVER + '/' + context.DB + '", "continuous":true}',
      function(){
        Sammy.log('replicating to ', context.SERVER)
      },"json");
  },
  
  replicateDown: function(){
    var context = this;
    $.post(context.HOST + '/_replicate', 
      '{"source":"' + context.SERVER + '/' + context.DB + '", "target":"' + context.DB + '", "continuous":true}',
      function(){
        Sammy.log('replicating from ', context.SERVER)
      },"json");
  }
}
