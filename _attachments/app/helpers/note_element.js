NoteElement = function NoteElement(target) {
  // console.log('constructing note element with target: ', target)
  this.note_target = target;
}

NoteElement.prototype = {
  noteLi: function(){
    return this.note_target.closest('li');
  },
  
  id: function(){
    return this.note_target.attr('id').match(/edit_text_(\w*)/)[1];
  },
  
  hasChildren: function(){
    return this.noteLi().children().is('ul.indent');
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
      context.update_object('Note', {id: this_note.id(), next_id: note._id}, {}, function(json){
        this_note.submitIfChanged();
      });
      this_note.renderNextNote(context, note, function(next){
        next.previousNote().unfocusTextarea();
        next.focusTextarea();
      });
    });
  },
  
  renderNotes: function(context, notes){
    var note_object = notes.findById(this.id());
    var child = note_object.firstChildNoteObject(notes.notes);
    var next = note_object.nextNoteObject(notes.notes);
    notes.notes = notes.notes.remove(note_object);
    
    if(typeof(child)!="undefined"){
      this.renderChildNote(context, child, function(child){
        child.renderNotes(context, notes);
      });
    } 
    if(typeof(next)!="undefined"){
      this.renderNextNote(context, next, function(next){
        next.renderNotes(context, notes);
      });
    }
  },
  
  renderNextNote: function(context, note_object, callback){
    var this_note = this;
    context.partial('app/templates/notes/edit.mustache', {_id: note_object._id, text: note_object.text}, function(html) {
      $(html).insertAfter(this_note.note_target.closest('li'));
      context.bindSubmitOnBlurAndAutogrow();
      var appended_note = this_note.nextNote();
      callback(appended_note);
      $('#spinner').hide();       
    });
  },
  
  renderChildNote: function(context, note_object, callback){
    var this_note = this;
    context.partial('app/templates/notes/edit.mustache', {_id: note_object._id, text: note_object.text}, function(html) {
      $(html).appendTo(this_note.note_target.closest('li')).wrap('<ul class="indent"></ul>');
      context.bindSubmitOnBlurAndAutogrow();
      var child_note = this_note.firstChildNote();
      callback(child_note);
      $('#spinner').hide();       
    });
  },
  
  focusTextarea: function(){
    this.noteLi().attr("data-focus", true);
    this.note_target.focus();
  },
  
  unfocusTextarea: function(){
    this.noteLi().removeAttr("data-focus");
  },
  
  focusPreviousTextarea: function(){
    var context = this;
    var previous_note;
    this.unfocusTextarea();
    
    if(this.previousNote() != null && this.previousNote().firstChildNote() == null){
      previous_note = this.previousNote();
    } else if(this.lastChildNoteLiOfPreviousNote() != null){
      previous_note = this.lastChildNoteOfPreviousNote();
    } else if(this.previousNote() == null && this.parentNote() != null){
      previous_note = this.parentNote();
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
    if(this.previousNote()){    
      this.indentUpdateNotePointers(context);
      this.indentNoteInDom();
      this.focusTextarea();
    }
   },
   
   indentNoteInDom: function(){
     if(this.previousNote().hasChildren()){
       this.previousNoteLi().children('ul').append(this.noteLi());
     } else {        
       this.previousNoteLi().append(this.noteLi());
       this.noteLi().wrap('<ul class="indent"></ul>');
     }
   },
   
   indentUpdateNotePointers: function(context){
     if(this.previousNote().hasChildren()) {
       this.setNextToNull(context);
       this.setLastChildOfPreviousNoteNextPointerToMyself(context);
     } else {
       this.setNextToNullAndParentToFormerPreviousNote(context);
     }
     if(this.nextNote()){
       this.setPreviousNextPointerToNextNote(context);
     } else {
       this.setPreviousNextPointerToNull(context);
     }
   },
   
   setNextToNull: function(context){
     context.update_object('Note', {id: this.id(), next_id: ''}, {}, function(note){});
   },
   setLastChildOfPreviousNoteNextPointerToMyself: function(context){
     context.update_object('Note', {id: this.lastChildNoteOfPreviousNote().id(), next_id: this.id()}, {}, function(note){});
   },
   setNextToNullAndParentToFormerPreviousNote: function(context){
     context.update_object('Note', {id: this.id(), next_id: '', parent_id: this.previousNote().id()}, {}, function(note){});
   },
   
   setPreviousNextPointerToNextNote: function(context){
     context.update_object('Note', {id: this.previousNote().id(), next_id: this.nextNote().id()}, {}, function(note){});
   },
   setPreviousNextPointerToNull: function(context){
     context.update_object('Note', {id: this.previousNote().id(), next_id: ''}, {}, function(note){});
   }


    //   
    // unindent: function(context){
        // if(this.parentNote()){    
        //   this.unIndentUpdateNotePointers(context);
        //   this.unIndentNoteInDom();
        //   this.focusTextarea();
        // }
    // },
    // 
    // unIndentNoteInDom: function(){
    // },
    // 
    // unIndentUpdateNotePointers: function(context){
    // 
    // }
}