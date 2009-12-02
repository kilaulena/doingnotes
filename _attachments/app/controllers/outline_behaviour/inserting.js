var Inserting = {
  insertAndFocusNewNoteAndSubmit: function(target) { 
    var context = this;  
    var target_id = context.getNoteId(target);
    var next_id = context.getNextNoteId(context, target);
    var attributes = {text: '', outline_id: context.getOutlineId(context)};
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