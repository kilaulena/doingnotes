ConflictDetector = function(context, couchapp) {
  this.couchapp        = couchapp;
  this.context         = context;
  this.presenter       = this.presenter || new ConflictPresenter(context, couchapp);
  this.resolver        = this.resolver  || new ConflictResolver(context, couchapp);

  this.solved_note_ids = [];
}

ConflictDetector.prototype = {
  checkForNewConflicts: function(){
    if (this.context.onServer()) return;
    var detector   = this;
    var url        = this.context.HOST + '/' + this.context.DB + 
                     '/_changes?filter=doingnotes/conflicted' +
                     '&feed=continuous&heartbeat=5000';
    
    if(detector.context.getOutlineId()){ 
      detector.listenForConflicts(url, function(responseText){
        detector.examineResponseText(responseText, function(json){
          detector.getFirstConflictingRevisionOfNote(json, function(overwritten_note_json, note_json){
            if(overwritten_note_json.next_id != note_json.next_id){
              Sammy.log('append conflict - do it automatically')
              resolver.solve_conflict_by_sorting(note_json, overwritten_note_json);
            } else if(overwritten_note_json.text != note_json.text){
              presenter.showWriteConflictWarning(overwritten_note_json, note_json);
              this.markNoteAsWriteConflicted(overwritten_note_json._id);
            }
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
    var detector = this;
    if(responseText.match(/changes/)){
      var lines = responseText.split("\n");
      if(lines[lines.length-2].length != 0){ 
        lines = lines.remove("");
        $.each(lines, function(i, line){  
          var json = JSON.parse(line);
          detector.couchapp.db.openDoc(json.id, {
            success: function(doc) {
              if(detector.context.getOutlineId() == doc.outline_id){
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
    var detector = this;
    if(!detector.solved_note_ids.contains(json.id)){
      detector.solved_note_ids.push(json.id);
      var url_note = detector.context.HOST + '/' + detector.context.DB + '/' + json.id + '?conflicts=true';
      $.getJSON(url_note, function(note_json){
        var url_overwritten_note = detector.context.HOST + '/' + detector.context.DB + '/' + json.id + '?rev=' + note_json._conflicts[0];
        $.getJSON(url_overwritten_note, function(overwritten_note_json){
          callback(overwritten_note_json, note_json);
        });
      });
    }
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
  }
};