OutlineView = function(outline) {
  this.outline = outline;
}

OutlineView.prototype = {
  object: function() {
    return this.outline;
  },
  _id: function() {
    return this.outline._id;
  },
  _rev: function() {
    return this.outline._rev;
  },
  title: function() {
    return this.outline.title;
  },
  created_at: function() {
    return this.outline.created_at;
  },
  updated_at: function() {
    return this.outline.updated_at;
  },
  not_new_record: function() {
    return this.outline.updated_at || false;
  }
}
