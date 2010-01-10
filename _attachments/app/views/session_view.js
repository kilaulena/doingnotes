SessionView = function(outline) {
  this.session = session;
}

SessionView.prototype = {
  object: function() {
    return this.session;
  },
  _id: function() {
    return this.session._id;
  },
  _rev: function() {
    return this.session._rev;
  },
  outline_id: function() {
    return this.session.outline_id;
  },
  etag: function(){
    return this.session.etag;
  }
}