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
  created_at: function() {
    return this.note.created_at;
  },
  updated_at: function() {
    return this.note.updated_at;
  },
  not_new_record: function() {
    return this.note.updated_at || false;
  }
}
