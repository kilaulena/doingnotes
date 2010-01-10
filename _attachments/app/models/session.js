Session = function(attributes) {
  this._id        = attributes._id;
  this._rev       = attributes._rev;
  this.created_at = attributes.created_at || new Date().toJSON();
  this.updated_at = attributes.updated_at;
  this.outline_id = attributes.outline_id;
  this.etag       = attributes.etag;
}

Session.prototype = {
  valid: function() {
    return true;
  },
  
  to_json: function() {
    var attributes = {
      _id: this._id,
      _rev: this._rev,
      created_at: this.created_at,
      updated_at: this.updated_at,
      type: 'Session',
      outline_id: this.outline_id
    };
    if(this.etag){
      attributes.etag = this.etag;
    };
    return attributes;
  }
};