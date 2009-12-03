describe 'indenting'
  
end

updateNotePointers: function(context, target_id, previous_id, next_id){
  if(typeof(previous_id)!="undefined"){
    //if this is not the first note, set the previous note's pointer to the note after myself
    context.update_object('Note', {id: previous_id, next_id: next_id}, {}, function(note){});
  }
  //set my next_id to null, my parent is my former previous note
  context.update_object('Note', {id: target_id, next_id: '', parent_id: previous_id}, {}, function(note){});
}