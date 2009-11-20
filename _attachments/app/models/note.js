Note = function(attributes) {
  this._id = attributes._id;
  this._rev = attributes._rev;
  this.created_at = attributes.created_at || new Date().toJSON();
  this.updated_at = attributes.updated_at;
  this.text = attributes.text;
  this.outline_id = attributes.outline_id;
  this.next_id = attributes.next_id;
  this.parent_id = attributes.parent_id;
}

Note.prototype = {
  valid: function() {
    return true;
  },
  to_json: function() {
    var attributes = {
      _id: this._id,
      _rev: this._rev,
      created_at: this.created_at,
      updated_at: this.updated_at,
      type: 'Note',
      text: this.text,
      outline_id: this.outline_id
    };
    if(this.next_id){
      attributes.next_id = this.next_id;
    };
    if(this.parent_id){
      attributes.parent_id = this.parent_id;
    };
    return attributes;
  },
  findNextNote: function(unsorted_notes){
    var this_note = this;
    var next_note = unsorted_notes.select(function(note){
      return this_note.next_id == note._id;
    })[0];
    if(typeof(next_note)!="undefined"){
      next_note.checkForOtherNotesPointingTo(unsorted_notes);
    }
    return next_note;
  }, 
  checkForOtherNotesPointingTo: function(unsorted_notes){
    var this_note = this;
    var notes_with_next_id = unsorted_notes.select(function(note){
      if(typeof(note.next_id)!="undefined"){
        return note.next_id == this_note.next_id; 
      }
    });
    if(notes_with_next_id.length > 1){
      throw 'There is more than one note with next_id "' + this_note.next_id +'"';
    };
  }
};

function notFirstNotes(notes){
  var not_first_notes = [];  
  $.each(notes, function(i, maybe_first_note){
    notes.select(function(note){
      if(typeof(note.next_id)!="undefined" && note.next_id == maybe_first_note._id){
        not_first_notes.push(maybe_first_note);
        return;
      }
    });
  });
  return not_first_notes;
};

function firstNote(unsorted_notes){
  var not_first_notes = notFirstNotes(unsorted_notes);
  var first_notes = unsorted_notes.subtract(not_first_notes);
  // if (first_notes.length > 1) {
  //   throw 'There is more than one note that could be the first one';
  // };
  return first_notes[0];
};

function sortByNextId(unsorted_notes) {
  var first_note = firstNote(unsorted_notes);
  var sorted_notes = [first_note];
  var note_looking_for_next_note = first_note;
  unsorted_notes = unsorted_notes.remove(first_note);
  
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