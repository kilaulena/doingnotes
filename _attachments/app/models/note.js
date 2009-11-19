Note = function(attributes) {
  this._id = attributes._id;
  this._rev = attributes._rev;
  this.created_at = attributes.created_at || new Date().toJSON();
  this.updated_at = attributes.updated_at;
  this.text = attributes.text;
  this.outline_id = attributes.outline_id;
  this.previous_id = attributes.previous_id;
}

Note.prototype = {
  valid: function() {
    return true;
  },
  to_json: function() {
    return {
      _id: this._id,
      _rev: this._rev,
      created_at: this.created_at,
      updated_at: this.updated_at,
      type: 'Note',
      text: this.text,
      outline_id: this.outline_id,
      previous_id: this.previous_id
    };
  },
  findNextNote: function(unsorted_notes){
    // console.log(unsorted_notes);
    var this_note = this;
    // console.log('es geht jetzt um ' +this_note._id);
    var next_notes = unsorted_notes.select(function(note){
      // if(this_note._id == note.previous_id) console.log('found the next note: ');
      // console.log(this_note._id);
      // console.log(note.previous_id);
      // console.log('---');
      return this_note._id == note.previous_id;
    });
    // console.log(next_notes);
    if(next_notes.length > 1){
      throw 'There is more than one note with previous id "' + next_notes[0].previous_id +'"';
    };
    // if(next_note != undefined) console.log('next node for it is ' +next_note._id);
    return next_notes[0];
  }
};

function sortByPreviousId(unsorted_notes) {
  var sorted_notes = unsorted_notes.reject(function(note){
    return note.previous_id != undefined;
  });
  if (sorted_notes.length > 1) {
    throw 'There is more than one note without a previous_id';
  };
  
  $.each(unsorted_notes, function(i, note_values){
    var note = new Note(note_values);
    var next_note = note.findNextNote(unsorted_notes);
    // console.log('the next note should be:');
    // console.log(next_note);
    if(next_note){
      sorted_notes.push(next_note);
      unsorted_notes = unsorted_notes.remove(next_note);
    }
  });
  // console.log(notes);
  return sorted_notes;
}