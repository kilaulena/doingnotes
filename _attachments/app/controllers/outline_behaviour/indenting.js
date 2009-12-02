var Indenting = {
  //split in dom manipulation and pointer updating
  indent: function(target){
    var context = this;  
    
    var target_id = context.getNoteId(target);
    var previous_id = context.getPreviousNoteId(context, target);
    var next_id = context.getNextNoteId(context, target);
    var parent_id = context.getParentNoteId(context, target);
    
    var next_li = target.closest('li').next();
    var previous_li = target.closest('li').prev();
    if(target.parent().parent().parent().parent().is('li')){
      var parent_li = target.parent().parent().parent().parent();
    };

    // console.log(parent_li);
    // console.log(previous_li);
    // console.log(next_li);

    if(previous_li.children().is('ul.indent')){
      //li before me is indented already
      context.updateNotePointers(context, target_id, previous_id, next_id, parent_id);
      previous_li.children('ul').append(target.closest('li'));
      target.parent().parent().prev().next().find('textarea').focus();
      
    } else if(next_li.children().is('ul.indent')){
      //li after me is indented already
      console.log('after me indented already')
      context.updateNotePointers(context, target_id, previous_id, next_id, parent_id);
      next_li.children('ul').prepend(target.closest('li'));   
      target.parent().parent().next().prev().find('textarea').focus();
             
    } else if(previous_li.children().is('form')) {        
      //lis before and after target are not indented yet
      context.updateNotePointers(context, target_id, previous_id, next_id, parent_id);
      previous_li.append(target.closest('li'));
      target.closest('li').wrap('<ul class="indent"></ul>');
      target.closest('li').find('textarea').focus();
    }
  },
  
  unindent: function(target){

  },

  updateNotePointers: function(context, target_id, previous_id, next_id){
    if(typeof(previous_id)!="undefined"){
      //if this is not the first note, set the previous note's pointer to the note after myself
      context.update_object('Note', {id: previous_id, next_id: next_id}, {}, function(note){});
    }
    //set my next_id to null, my parent is my former previous note
    context.update_object('Note', {id: target_id, next_id: '', parent_id: previous_id}, {}, function(note){});
  }
}