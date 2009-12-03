NoteElement = function(target) {
  this.note_target = target;
}

NoteElement.prototype = {
  getIdFromDom: function(){
    return this.note_target.attr('id').match(/edit_text_(\w*)/)[1];
  },
  
  noteLi: function(){
    return this.note_target.closest('li');
  },
  
  nextNoteLi: function(){
    return this.note_target.closest('li').next();
  },
  
  previousNoteLi: function(){
    return this.note_target.closest('li').prev();
  },
  
  parentNoteLi: function(){
    return this.note_target.closest('li').parents('li:first');
  },
  
  submitIfChanged: function() {
    var target = this.note_target;
    if(target.attr("data-text") != target.val()) {
      target.removeAttr("data-text");
      target.parent('form').submit();
    }
  },
  
  insertNewNote: function() { 
    var context = this;  
    var attributes = {text: '', outline_id: context.getOutlineId()};
    if (this.nextNoteLi() != null){
      var next_id = this.nextNoteLi().getIdFromDom();
      attributes.next_id = next_id;
    }

    context.create_object('Note', attributes, {}, function(note){ 
      context.update_object('Note', {id: target_id, next_id: note.id}, {}, function(note){
        context.submitIfChanged(target);
      });
      context.partial('app/templates/notes/edit.mustache', {_id: note.id}, function(html) { 
        $(html).insertAfter(target.closest('li')).find('textarea').focus();
        context.bindSubmitOnBlurAndAutogrow();
        $('#spinner').hide(); 
      });
    });
  }
}