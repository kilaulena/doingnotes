ConflictPresenter = function(context, couchapp) {
  this.context  = context;
  this.couchapp = couchapp;
}

ConflictPresenter.prototype = {
  dropDownConflictWarning: function(){
    if(this.context.$element().find('#conflict-warning:visible').length == 0){
      $('#conflict-warning').slideDown('slow');
    }  
  },
  
  highlightNoteOkay: function(id){
    var note_element = this.context.findNoteElementById(id);
    note_element.emphasizeBackground(this.context, true);
  },
  
  highlightNoteConflicted: function(id){
    var note_element = this.context.findNoteElementById(id);
    note_element.emphasizeBackground(this.context, false);
  },
  
  showWriteConflictWarning: function(id){
    Sammy.log('write conflict - ask the user')
    this.dropDownConflictWarning();
    this.highlightNoteConflicted(id);
  },
  
  showConflicts: function(){
    var presenter = this;
    presenter.couchapp.design.view('notes_with_conflicts_by_outline', {
      key: presenter.context.getOutlineId(),
      success: function(json) {
        if (json.rows.length > 0) {
          var notes_with_conflicts = json.rows.map(function(row) {return row.value});
          $.each(notes_with_conflicts, function(i, conflicting_note_json){
            var url = presenter.context.HOST + '/' + presenter.context.DB + '/' + conflicting_note_json._id + '?rev=' + conflicting_note_json._conflicts[0];
            $.getJSON(url, function(overwritten_note_json){
              var note_element = presenter.context.findNoteElementById(overwritten_note_json._id);
              note_element.insertConflictFields(presenter.context, overwritten_note_json, conflicting_note_json);
            });
          });
        }
      }
    });
  }
};