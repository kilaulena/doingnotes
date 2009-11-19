Note = function(attributes) {
  this._id = attributes._id;
  this._rev = attributes._rev;
  this.created_at = attributes.created_at || new Date().toJSON();
  this.updated_at = attributes.updated_at;
  this.text = attributes.text;
  this.outline_id = attributes.outline_id;
  this.previous_id = attributes.previous_id;
  this.parent_id = attributes.parent_id;
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
      previous_id: this.previous_id,
      parent_id: this.parent_id
    };
  },
  findNextNote: function(unsorted_notes){
    var this_note = this;
    var next_notes = unsorted_notes.select(function(note){
      return this_note._id == note.previous_id;
    });
    if(next_notes.length > 1){
      throw 'There is more than one note with previous_id "' + next_notes[0].previous_id +'"';
    };
    return next_notes[0];
  }
};

function firstNote(unsorted_notes){
  var sorted_notes = unsorted_notes.reject(function(note){
    return note.previous_id != undefined;
  });
  if (sorted_notes.length > 1) {
    throw 'There is more than one note without a previous_id';
  };
  return sorted_notes[0];  
};

function sortByPreviousId(unsorted_notes) {
  var sorted_notes = [firstNote(unsorted_notes)];
  var note_looking_for_next_note = sorted_notes[0];
  unsorted_notes = unsorted_notes.remove(note_looking_for_next_note);

  while(unsorted_notes.length > 0){
    var next_note = note_looking_for_next_note.findNextNote(unsorted_notes);
    if(typeof(next_note)=="undefined"){
      break;
    } else {
      sorted_notes.push(next_note);
      note_looking_for_next_note = next_note;
      unsorted_notes = unsorted_notes.remove(next_note);
      // console.log('unsorted notes at the end of while loop:');
      // console.log(unsorted_notes);
    }
  };
  console.log('its empty!');
  return sorted_notes;
}
