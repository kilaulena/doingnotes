Note = function(attributes) {
  this._id = attributes._id;
  this._rev = attributes._rev;
  this.created_at = attributes.created_at || new Date().toJSON();
  this.updated_at = attributes.updated_at;
  this.text = attributes.text;
  this.source = attributes.source;
  this.outline_id = attributes.outline_id;
  this.next_id = attributes.next_id;
  this.parent_id = attributes.parent_id;
  this.first_note = attributes.first_note;
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
      source: this.source,
      outline_id: this.outline_id
    };
    if(this.next_id){
      attributes.next_id = this.next_id;
    };
    if(this.parent_id){
      attributes.parent_id = this.parent_id;
    };
    if(this.first_note){
      attributes.first_note = this.first_note;
    };
    return attributes;
  },
  
  nextNoteObject: function(notes){
    var this_note = this;
    var next_note = notes.select(function(note){
      return this_note.next_id == note._id;
    })[0];
    if(typeof(next_note)!="undefined"){
      next_note.checkForOtherNotesPointingTo(notes);
    }
    return next_note;
  },
   
  checkForOtherNotesPointingTo: function(notes){
    var this_note = this;
    var notes_with_next_id = notes.select(function(note){
      if(typeof(note.next_id)!="undefined"){
        return note.next_id == this_note.next_id; 
      }
    });
    if(notes_with_next_id.length > 1){
      console.log('this is the note that is examined: ', this_note._id)
      console.log('this is the next_id: ', this_note.next_id)
      console.log('this is what is in the array:', notes_with_next_id[0]._id, ' ... ', notes_with_next_id[1]._id)
      // throw 'More than one note pointing to "' + this_note.next_id + '" found';
    };
  },
  
  firstChildNoteObject: function(notes){
    var this_note = this;
    var first_child_notes = [];
    $.each(notes, function(i, note){
       if(this_note._id == note.parent_id){
        first_child_notes.push(note); 
       }
    });
    if(first_child_notes.length > 1){
      throw 'More than one first child note for "' + this_note._id + '" found';
    }
    return first_child_notes[0];
  }
};

