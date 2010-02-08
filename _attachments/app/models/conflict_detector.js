ConflictDetector = function(context, couchapp) {
  console.log('a new ConflictDetector')
  this.couchapp                  = couchapp;
  this.context                   = context;
  this.presenter                 = this.presenter || new ConflictPresenter(context, couchapp);
  this.resolver                  = this.resolver  || new ConflictResolver(context, couchapp);
  this.notes_with_conflict       = [];
  this.notes_with_write_conflict = [];
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
            } 
            if(overwritten_note_json.text != note_json.text){
              presenter.showWriteConflictWarning(overwritten_note_json, note_json);
              console.log('PUSHING', overwritten_note_json._id)
              detector.notes_with_write_conflict.push(overwritten_note_json._id);
              console.log(detector.notes_with_write_conflict)
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
      Sammy.log('checkForConflicts has timed out ...')
    }
  },
  
  getFirstConflictingRevisionOfNote: function(json, callback){
    var detector = this;
    if(!detector.notes_with_conflict.contains(json.id)){
      detector.notes_with_conflict.push(json.id);
      var url_note = detector.context.HOST + '/' + detector.context.DB + '/' + json.id + '?conflicts=true';
      $.getJSON(url_note, function(note_json){
        var url_overwritten_note = detector.context.HOST + '/' + detector.context.DB + '/' + json.id + '?rev=' + note_json._conflicts[0];
        $.getJSON(url_overwritten_note, function(overwritten_note_json){
          callback(overwritten_note_json, note_json);
        });
      });
    }
  },
  
  saveNotesWithWriteConflict: function(){
    console.log('saveNotesWithWriteConflict', this)
    console.log('notes_with_write_conflict', this.notes_with_write_conflict)
    console.log('outlineId', this.context.getOutlineId())
    
    // this.context.update_object('Outline', {id: this.context.getOutlineId(), notes_with_write_conflict: this.notes_with_write_conflict}, 
    //   // {},
    //    {success: function(obj){console.log('success', obj)}}, 
    //    function(outline){
    //      console.log('updated. and outline is: ', outline)
    //    }
    //  );
  }
};