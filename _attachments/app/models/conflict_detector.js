ConflictDetector = function(context, couchapp) {
  var getInstance = function() {
		if (!this.singletonInstance) { 
			this.singletonInstance = createInstance();
		}
		return this.singletonInstance;
	}
	
	var createInstance = function() {
		return {
		  couchapp                  : couchapp,
      context                   : context,
      presenter                 : this.presenter || new ConflictPresenter(context, couchapp),
      resolver                  : this.resolver  || new ConflictResolver(context, couchapp),
      notes_with_conflict       : [],
      notes_with_write_conflict : {},
		  
		  checkForOldConflicts: function(){
		    if (this.context.onServer()) return;
		    var dt = this;
		    
        if(dt.context.getOutlineId() && typeof(dt.notes_with_write_conflict[dt.context.getOutlineId()]) != 'undefined'){
          $.each(dt.notes_with_write_conflict[dt.context.getOutlineId()], function(i, id){  
            dt.getFirstConflictingRevisionOfNote(id, function(overwritten_note_json, note_json){
              presenter.showWriteConflictWarning(overwritten_note_json, note_json);
              dt.notes_with_write_conflict[dt.context.getOutlineId()].remove(overwritten_note_json._id);
            });  
          });
        }
		  },
		  		  
      checkForNewConflicts: function(){
        if (this.context.onServer()) return;
        var detector   = this;
        var url        = this.context.HOST + '/' + this.context.DB + 
                         '/_changes?filter=doingnotes/conflicted' +
                         '&feed=continuous&heartbeat=5000';

        if(detector.context.getOutlineId()){ 
          detector.notes_with_write_conflict[detector.context.getOutlineId()] = detector.notes_with_write_conflict[detector.context.getOutlineId()] || [];
          detector.listenForConflicts(url, function(responseText){
            detector.examineResponseText(responseText, function(id, lines){
              detector.checkIfConflictNeedsToBeHandled(id, lines, function(id){
                detector.getFirstConflictingRevisionOfNote(id, function(overwritten_note_json, note_json){
                  detector.identifyAndHandleConflict(overwritten_note_json, note_json);
                });
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
              callback(json.id, lines);
            });
          }
        }
        if(responseText.match(/last_seq/)){
          Sammy.log('checkForConflicts has timed out ...')
        }
      },

      checkIfConflictNeedsToBeHandled: function(id, lines, callback){
        var detector = this;
        detector.couchapp.db.openDoc(id, {
          success: function(doc) {
            if(detector.context.getOutlineId() == doc.outline_id){
              Sammy.log('Conflicts here: \n', lines);
              if(!detector.notes_with_conflict.contains(id)){
                detector.notes_with_conflict.push(id);  
                callback(id);
              }
            }
          }
        });
      },

      getFirstConflictingRevisionOfNote: function(id, callback){
        var detector = this;
        var url_note = detector.context.HOST + '/' + detector.context.DB + '/' + id + '?conflicts=true';
        $.getJSON(url_note, function(note_json){
          var url_overwritten_note = detector.context.HOST + '/' + detector.context.DB + '/' + id + '?rev=' + note_json._conflicts[0];
          $.getJSON(url_overwritten_note, function(overwritten_note_json){
            callback(overwritten_note_json, note_json);
          });
        });
      },

      identifyAndHandleConflict: function(overwritten_note_json, note_json){
        var dt = this;
        if(overwritten_note_json.next_id != note_json.next_id){
          Sammy.log('append conflict - do it automatically')
          dt.resolver.solve_conflict_by_sorting(note_json, overwritten_note_json);
        } 
        if(overwritten_note_json.text != note_json.text){
          presenter.showWriteConflictWarning(overwritten_note_json, note_json);
          dt.notes_with_write_conflict[dt.context.getOutlineId()].push(overwritten_note_json._id);
        }
      }
		}
	}
	return getInstance();
}
