NoteElement = function NoteElement(target) {
  if(typeof(target)=="undefined" || !target.val || typeof(target.val())=="undefined"){
    throw "NoteElement can't be instantiated without a valid note_target"
  }
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
    if(this.firstChildNoteLi()!=null){   
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
    if(this.targetHasChanged()) {
      this.note_target.removeAttr("data-text");
      this.submitForm();
      this.setDataText();
    }
  },
  
  targetHasChanged: function(){
    return (this.note_target.attr("data-text") != this.note_target.val());
  },
  
  submitForm: function(){
    this.note_target.parent('form').submit();
  },
  
  insertNewNote: function(context) { 
    var this_note = this;
    var attributes = {text: '', outline_id: context.getOutlineId()};
    if (this_note.nextNote() != null){
      attributes.next_id = this_note.nextNote().id();
    }
    context.create_object('Note', attributes, {}, function(note_object){ 
      this_note.insertUpdateNotePointers(context, note_object);
      this_note.renderFollowingNote(context, note_object, function(next){
        this_note.noteLi().children('ul.indent:first').appendTo(next.noteLi());
        context.unbindSubmitOnBlurAndAutogrow();        
        context.bindSubmitOnBlurAndAutogrow();
        next.previousNote().unfocusTextarea();
        next.focusTextarea();
      });
    }); 
  },
  
  insertUpdateNotePointers: function(context, inserted_note_object){
    this.setNextPointerToNewlyInsertedNote(context, inserted_note_object);
    if(this.hasChildren()){
      this.setParentPointerOfFirstChildToNewlyInsertedNote(context, inserted_note_object);
    }
  },
  
  setNextPointerToNewlyInsertedNote: function(context, inserted_note_object){
    var this_note = this;
    context.update_object('Note', {id: this_note.id(), next_id: inserted_note_object._id}, {}, function(json){
      this_note.submitIfChanged();
    });
  },
  
  setParentPointerOfFirstChildToNewlyInsertedNote: function(context, inserted_note_object){
    context.update_object('Note', {id: this.firstChildNote().id(), parent_id: inserted_note_object._id}, {}, function(json){});
  },
  
  renderNotes: function(context, notes, counter){
    if (notes.notes.length == 0) return;
    if(typeof(context.i)=="undefined"){
      context.i = counter;
    } else {
      context.i = context.i-1;
    }
    var note_object = notes.findById(this.id());
    var child_object = note_object.firstChildNoteObject(notes.notes);
    var next_object = note_object.nextNoteObject(notes.notes);
    notes.notes = notes.notes.remove(note_object);
    
    if(typeof(child_object)!="undefined"){
      this.renderFollowingNote(context, child_object, function(child){
        child.renderNotes(context, notes);
      });
    } 
    if(typeof(next_object)!="undefined"){
      this.renderFollowingNote(context, next_object, function(next){
        next.renderNotes(context, notes);
      });
    }
    if (context.i == 1) {
      context.unbindSubmitOnBlurAndAutogrow();
      context.bindSubmitOnBlurAndAutogrow();
      $('#spinner').hide();
      context.i = 0;
    }
  },
  
  renderFollowingNote: function(context, note_object, callback){
    var this_note = this;
    context.partial('app/templates/notes/edit.mustache', {_id: note_object._id, text: note_object.text}, function(html) {
      if(typeof note_object.parent_id != "undefined"){
        $(html).appendTo(this_note.note_target.closest('li')).wrap('<ul class="indent"></ul>');
        callback(this_note.firstChildNote());
      } else {
        $(html).insertAfter(this_note.note_target.closest('li'));
        callback(this_note.nextNote());        
      }      
    });
  },
  
  focusTextarea: function(){
    this.noteLi().attr("data-focus", true);
    this.note_target.parent().addClass("active");
    this.note_target.focus();
  },
  
  unfocusTextarea: function(){
    this.note_target.parent().removeClass("active");
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
   },
      
    unindent: function(context){
      if(this.parentNote()){    
        this.unindentUpdateNotePointers(context);
        this.unindentNoteInDom();
        this.focusTextarea();
      }
    },
    
    unindentNoteInDom: function(){
      if(this.previousNote()){
        if(this.nextNote()){
          var my_new_children = $("li#edit_note_" + this.id() + " ~ li")
          this.parentNoteLi().after(this.noteLi());
          this.noteLi().append('<ul class="indent"></ul>');
          this.noteLi().children('ul.indent').append(my_new_children);
        } else {
          this.parentNoteLi().after(this.noteLi());
        }
      } else {
        if(this.nextNote()){
          var my_new_children = this.parentNoteLi().children('ul:indent');
          this.parentNoteLi().after(this.noteLi());
          this.noteLi().append(my_new_children);
        } else {
          this.noteLi().unwrap('<ul class="indent"></ul>');
          this.parentNoteLi().after(this.noteLi());
        }
      }
    },
    
    unindentUpdateNotePointers: function(context){
    
    }
}