NoteElement = function(target) {
  this.note_target = target;
}

NoteElement.prototype = {
  noteLi: function(){
    return this.note_target.closest('li');
  },
  
  nextNoteLi: function(){
    if(this.noteLi().next().length){
      return this.note_target.closest('li').next();
    } 
  },
  previousNoteLi: function(){
    if(this.noteLi().prev().length){
      return this.note_target.closest('li').prev();
    }
  },
  parentNoteLi: function(){
    if(this.noteLi().parents('li:first').length){
      return this.note_target.closest('li').parents('li:first');
    }
  },
  firstChildNoteLi: function(){
    if(this.noteLi().children('ul.indent').length){
      return this.noteLi().children('ul.indent').children('li:first')
    }
  },
  nextNoteLiOfClosestAncestor: function(){
    parents = this.noteLi().parents('li');
    var note;
    $.each(parents, function(i, parent_li){
      if (!note && $(parent_li).next().length){
        note = $(parent_li).next();
      }
    });
    return note;
  },
  lastChildNoteLiOfPreviousNote: function(){
    if(this.noteLi().prev() && this.noteLi().prev().find('li').length){
      var previous = this.noteLi().prev();
      return previous.find('li:last');
    }
  },

  id: function(){
    return this.note_target.attr('id').match(/edit_text_(\w*)/)[1];
  },
  nextNote: function(){    
    if(this.nextNoteLi()!= null){    
      return new NoteElement(this.nextNoteLi().find('textarea:first'));
    }
  },
  previousNote: function(){
    if(this.previousNoteLi()!= null){    
      return new NoteElement(this.previousNoteLi().find('textarea:first'));
    }
  },
  parentNote: function(){
    if(this.parentNoteLi()!= null){    
      return new NoteElement(this.parentNoteLi().find('textarea:first'));
    }
  },
  firstChildNote: function(){
    if(this.firstChildNoteLi()!= null){    
      return new NoteElement(this.firstChildNoteLi().find('textarea:first'));
    }
  },
  nextNoteOfClosestAncestor: function(){
    if(this.nextNoteLiOfClosestAncestor()!= null){    
      return new NoteElement(this.nextNoteLiOfClosestAncestor().find('textarea:first'));
    }
  },
  lastChildNoteOfPreviousNote: function(){
    if(this.lastChildNoteLiOfPreviousNote()!= null){    
      return new NoteElement(this.lastChildNoteLiOfPreviousNote().find('textarea:first'));
    }
  },
  
  
  setDataText: function(){
    var target = this.note_target;
    if (typeof(target.attr("data-text"))=="undefined") { 
      target.attr("data-text", target.val());  
    };
  },
  
  submitIfChanged: function() {
    var target = this.note_target;
    if(target.attr("data-text") != target.val()) {
      target.removeAttr("data-text");
      target.parent('form').submit();
    }
  },
  
  insertNewNote: function(context) { 
    var this_note = this;
    var attributes = {text: '', outline_id: context.getOutlineId()};
    if (this.nextNote() != null){
      attributes.next_id = this.nextNote().id();
    }
    context.create_object('Note', attributes, {}, function(note){ 
      context.update_object('Note', {id: this_note.id(), next_id: note.id}, {}, function(json){
        this_note.submitIfChanged();
      });
      context.partial('app/templates/notes/edit.mustache', {_id: note.id}, function(html) { 
        $(html).insertAfter(this_note.note_target.closest('li'));
        note_object = new NoteElement(this_note.nextNote().note_target);
        this_note.unfocusTextarea();
        note_object.focusTextarea();
        context.bindSubmitOnBlurAndAutogrow();
        $('#spinner').hide(); 
      });
    });
  },
  
  focusTextarea: function(){
    this.noteLi().attr("data-focus", true);
    this.note_target.focus();
    // console.log('setting focus of '+ this.id() +' to true ('+ this.noteLi().attr("data-focus") +'!) on ' + this.note_target.val())
  },
  
  unfocusTextarea: function(){
    this.noteLi().removeAttr("data-focus");
    // console.log('removing focus of '+ this.id() +' (its now '+ this.noteLi().attr("data-focus") +'!) on ' + this.note_target.val())
  },
  
  focusPreviousTextarea: function(){
    var context = this;
    var previous_note;
    this.unfocusTextarea();
    
    if(this.previousNote() != null && this.previousNote().firstChildNote() == null){
      previous_note = this.previousNote();
    } else if(this.lastChildNoteLiOfPreviousNote() != null){
      previous_note = this.lastChildNoteOfPreviousNote();
    } else {
      previous_note = this;
    }
    previous_note.focusTextarea();
  },

  focusNextTextarea: function(){
    var context = this;
    var next_note;
    this.unfocusTextarea();
    
    if(this.firstChildNote() != null){
      next_note = this.firstChildNote();
    } else if(this.nextNote() != null){
      next_note = this.nextNote(); 
    } else if(this.nextNoteLiOfClosestAncestor() != null) {
      next_note = this.nextNoteOfClosestAncestor();
    } else {
      next_note = this;
    }
    next_note.focusTextarea();
  },
  
  indent: function(context){
    this.updateNotePointers(context);



     // // pointer updating
     // var target_id = context.getNoteId(target);
     // var previous_id = context.getPreviousNoteId(context, target);
     // var next_id = context.getNextNoteId(context, target);
     // var parent_id = context.getParentNoteId(context, target); 
     // context.updateNotePointers(context, target_id, previous_id, next_id, parent_id);
     // 
     // var next_li = target.closest('li').next();
     // var previous_li = target.closest('li').prev();
     // // if(target.parent().parent().parent().parent().is('li')){
     // //   var parent_li = target.parent().parent().parent().parent();
     // // };
     // var parent_li = target.parents('li:first')





     // if(previous_li.children().is('ul.indent')){
     //   //li before me is indented already
     //   previous_li.children('ul').append(target.closest('li'));
     //   target.parent().parent().prev().next().find('textarea').focus();
     // 
     // } else if(next_li.children().is('ul.indent')){
     //   //li after me is indented already
     //   console.log('after me indented already')
     //   next_li.children('ul').prepend(target.closest('li'));   
     //   target.parent().parent().next().prev().find('textarea').focus();
     // 
     // } else if(previous_li.children().is('form')) {        
     //   //lis before and after target are not indented yet
     //   previous_li.append(target.closest('li'));
     //   target.closest('li').wrap('<ul class="indent"></ul>');
     //   target.closest('li').find('textarea').focus();
     // 
     // } else {
     //   throw "something unexpected happened during pointer update in indenting"
     // }
   },

   unindent: function(target){

   },

   updateNotePointers: function(context){
     if(!this.previousNote()){
       //if this is not the first note, set the previous note's pointer to the note after myself
       context.update_object('Note', {id: this.previousNote().id(), next_id: this.nextNote().id()}, {}, function(note){});
     }
     //set my next_id to null, my parent is my former previous note
     context.update_object('Note', {id: this.id(), next_id: '', parent_id: this.previousNote().id()}, {}, function(note){});
   }
}