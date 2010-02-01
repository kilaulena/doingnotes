Outline = function(attributes) {
  this._id        = attributes._id;
  this._rev       = attributes._rev;
  this.created_at = attributes.created_at || new Date().toJSON();
  this.updated_at = attributes.updated_at;
  this.title      = stripBlanks(attributes.title);

}

Outline.prototype = {
  valid: function() {
    this.errors = [];
    if(!this.title) {
      this.errors.push("You need to enter a title");
    };
    if(this.title.match(/[^\w -]/)){
      this.errors.push("Only letters, numbers, blanks and - are allowed.");
    };
    if(this.title.length < 3){
      this.errors.push("Please enter at least 3 characters.")
    };
    return this.errors.length === 0;
  },
  
  to_json: function() {
    var attributes = {
      _id: this._id,
      _rev: this._rev,
      created_at: this.created_at,
      updated_at: this.updated_at,
      type: 'Outline',
      title: this.title
    };
    return attributes;
  }
};

function byDate(a, b) {
  var x = a.created_at;
  var y = b.created_at;
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}