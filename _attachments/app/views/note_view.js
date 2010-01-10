NoteView = function(note) {
  this.note = note;
}

NoteView.prototype = {
  object: function() {
    return this.note;
  },
  _id: function() {
    return this.note._id;
  },
  _rev: function() {
    return this.note._rev;
  },
  text: function() {
    return this.note.text;
  },
  source: function() {
    return this.note.source;
  },
  created_at: function() {
    return this.note.created_at;
  },
  updated_at: function() {
    return this.note.updated_at;
  },
  not_new_record: function() {
    return this.note.updated_at || false;
  },
  outline_id: function() {
    return this.note.outline_id;
  },
  next_id: function() {
    return this.note.next_id;
  },
  parent_id: function(){
    return this.note.parent_id;
  }
}
