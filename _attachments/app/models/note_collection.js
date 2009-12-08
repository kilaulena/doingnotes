NoteCollection = function(notes) {
  this.notes = notes;
}

NoteCollection.prototype = {
  firstNote: function(){
    var first_notes = []; 
    $.each(this.notes, function(i, note){
      if(typeof(note.first_note)!="undefined" && note.first_note == true){
        first_notes.push(note);
      }
    });
    if (first_notes.length > 1) {
      throw 'More than one first note found';
    };
    return first_notes[0];
  },
  
  findById: function(id){
    var note = this.notes.select(function(note){
      if(note._id == id) {
        return note;
      }
    })[0];
    return note;
  }
}