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
  long_created_at: function() {
    return dateFormat(this.outline.created_at, "dddd, mmmm dS yyyy, h:MM TT");
  },
  short_created_at: function() {
    return dateFormat(this.outline.created_at, "m/dd/yy, h:MM TT");
  },
  not_new_record: function() {
    return this.outline.updated_at || false;
  }
}
