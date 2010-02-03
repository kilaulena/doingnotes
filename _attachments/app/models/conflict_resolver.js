ConflictResolver = function(context, couchapp) {
  this.couchapp   = couchapp;
  this.context    = context;
  this.outline_id = context.getOutlineId();
}

ConflictResolver.prototype = {
  checkForNewConflicts: function(){
    if (this.context.onServer()) return;
    var context    = this.context;
    var resolver   = this;
    var url        = context.HOST + '/' + context.DB + 
                     '/_changes?filter=doingnotes/conflicted' +
                     '&feed=continuous&heartbeat=5000';
    var solved_ids = [];
    
    if(this.outline_id){ 
      listenForConflicts(url, function(responseText){
        if(responseText.match(/changes/)){
          var lines = responseText.split("\n");
          if(lines[lines.length-2].length != 0){ 
            lines = lines.remove("");
            $.each(lines, function(i, line){  
              var json = JSON.parse(line);
              this.couchapp.db.openDoc(json.id, {
                success: function(doc) {
                  if(this.outline_id == doc.outline_id){
                    Sammy.log('Conflicts here: \n', lines)                                      
                    context.getFirstConflictingRevisionOfNoteAndShowWarning(context, this.couchapp, solved_ids, json);
                  }
                }
              });
            });
          }
        }
        if(responseText.match(/last_seq/)){
          Sammy.log('Timeout in checkForConflicts:', xmlhttp.responseText)
        }        
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
  }
};