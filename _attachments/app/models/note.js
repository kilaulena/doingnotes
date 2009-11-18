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
    return unsorted_notes.select(function(note){
      return this._id == note.previous_id;
    });
  }
};

function sortByPreviousAndNext(unsorted_notes) {
  notes = unsorted_notes.reject(function(note){
    return note.previous_id != undefined;
  });
  if (notes.length > 1) {
    throw 'There is more than one note without a previous_id';
  };
  $.each(unsorted_notes, function(i, note_values){
    var note = new Note(notes[i]);
    notes.push(note.findNextNote(unsorted_notes));
  });
  console.log(notes);
  return notes;
}