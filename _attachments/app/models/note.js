Note = function(attributes) {
  this._id = attributes._id;
  this._rev = attributes._rev;
  this.created_at = attributes.created_at || new Date().toJSON();
  this.updated_at = attributes.updated_at;
  this.text = attributes.text;
  this.outline_id = attributes.outline_id;
  this.previous_id = attributes.previous_id;
  this.next_id = attributes.next_id;
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
      next_id: this.next_id
    };
  }
};