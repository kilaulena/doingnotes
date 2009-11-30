var Inserting = {
  //split in dom manipulation and pointer updating
  insertAndFocusNewNoteAndSubmit: function(target) { 
    var context = this;  
    var target_id = context.getNoteId(target);
    var next_id = context.getNextNoteId(context, target);
    var attributes = {text: '', outline_id: $('h2#outline-id').html()};
    if(typeof(next_id)!="undefined"){
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