NoteElement = function NoteElement(target) {
  if(typeof(target)=="undefined" || !target.val || typeof(target.val())=="undefined"){
    throw "NoteElement can't be instantiated without a valid note_target"
  }
  this.note_target = target;
}

NoteElement.prototype = {
  noteTarget: function(){
    if(this.note_target.parent('form.edit-note').css('display') != 'none'){
      return this.note_target;
    } else {
      return this.note_target.closest('li').children('div.solve_text').children('form:first').children('textarea:first');
    }
  },
  
  noteLi: function(){
    return this.note_target.closest('li');
  },
  
  id: function(){
    return this.note_target.attr('id').match(/edit_text_(\w*)/)[1];
  },
  
  text: function(){
    return this.note_target.text();
  },
  
  emphasizeBackground: function(){
    this.note_target.parents('form').css("background-color", "#FFFDE1");
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
  lastDirectChildNoteLiOfPreviousNote: function(){
    if(this.noteLi().prev() && this.noteLi().prev().find('li').length){
      return this.previousNote().noteLi().children('ul.indent').children('li:last')
    }
  },
  firstSiblingNoteLi: function(){
    if(this.noteLi().prev().length){ 
      var previous_notes = this.noteLi().prevAll().get();
      return $(previous_notes[previous_notes.length-1])
    }
  },

  nextNote: function(){    
    if(this.nextNoteLi()!= null){    
      return new NoteElement(this.nextNoteLi().find('textarea.expanding:first'));
    }
  },
  previousNote: function(){
    if(this.previousNoteLi()!= null){    
      return new NoteElement(this.previousNoteLi().find('textarea.expanding:first'));
    }
  },
  parentNote: function(){
    if(this.parentNoteLi()!= null){    
      return new NoteElement(this.parentNoteLi().find('textarea.expanding:first'));
    }
  },
  firstChildNote: function(){
    if(this.firstChildNoteLi()!=null){   
      return new NoteElement(this.firstChildNoteLi().find('textarea.expanding:first'));
    }
  },
  nextNoteOfClosestAncestor: function(){
    if(this.nextNoteLiOfClosestAncestor()!= null){    
      return new NoteElement(this.nextNoteLiOfClosestAncestor().find('textarea.expanding:first'));
    }
  },
  lastChildNoteOfPreviousNote: function(){
    if(this.lastChildNoteLiOfPreviousNote()!= null){    
      return new NoteElement(this.lastChildNoteLiOfPreviousNote().find('textarea.expanding:first'));
    }
  },
  lastDirectChildNoteOfPreviousNote: function(){
    if(this.lastDirectChildNoteLiOfPreviousNote()!= null){    
      return new NoteElement(this.lastDirectChildNoteLiOfPreviousNote().find('textarea.expanding:first'));
    }
  },
  firstSiblingNote: function(){
    if(this.firstSiblingNoteLi()!= null){    
      return new NoteElement(this.firstSiblingNoteLi().find('textarea.expanding:first'));
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
    var attributes = {text: '', outline_id: context.getOutlineId(), source: context.getLocationHash()};
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
    if (notes.notes.length == 1) {
      context.unbindSubmitOnBlurAndAutogrow();
      context.bindSubmitOnBlurAndAutogrow();
      $('#spinner').hide();
      context.i = 0;
    }
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
    if(typeof(next_object)=="undefined" && typeof(child_object)=="undefined"){
      context.unbindSubmitOnBlurAndAutogrow();
      context.bindSubmitOnBlurAndAutogrow();
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
    this.noteTarget().parent('form').addClass("active");
    this.noteTarget().focus();
  },
  
  unfocusTextarea: function(){
    this.noteTarget().parent('form').removeClass("active");
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
  
  focusOtherInlineTextarea: function(){
    var other_textarea;
    this.unfocusTextarea();

    other_textarea = this.noteTarget().parent('form').siblings('form').children('textarea');
    other_textarea.parent('form').addClass("active");
    other_textarea.focus();
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
    context.update_object('Note', {id: this.lastDirectChildNoteOfPreviousNote().id(), next_id: this.id()}, {}, function(note){});
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
    if(this.nextNote()){
      var my_new_children = this.noteLi().nextAll();
      this.parentNoteLi().after(this.noteLi());
      if(!this.noteLi().children('ul.indent').length){
        this.noteLi().append('<ul class="indent"></ul>');
      }
      this.noteLi().children('ul.indent').append(my_new_children);
    } else {
      if(this.previousNote()){
        this.parentNoteLi().after(this.noteLi());
      } else {
        this.noteLi().unwrap('<ul class="indent"></ul>');
        this.parentNoteLi().after(this.noteLi());
      }
    }
  },
    
  unindentUpdateNotePointers: function(context){
    if(this.parentNote()){
      this.setParentToNullAndNextToParentsNextNote(context);
      if(this.previousNote()){
        this.setFirstSiblingsParentsNextPointerToMyself(context);
        this.setNextPointerOfPreviousNoteToNull(context);
      } else {
        this.setParentsNextPointerToMyself(context);
      }
      if(this.nextNote()){
        this.setNextsParentPointerToMyself(context);
      }
    }
  },
  
  setNextPointerOfPreviousNoteToNull: function(context){
    context.update_object('Note', {id: this.previousNote().id(), next_id: ''}, {}, function(note){});
  },
  
  setFirstSiblingsParentsNextPointerToMyself: function(context){
    context.update_object('Note', {id: this.firstSiblingNote().parentNote().id(), next_id: this.id()}, {}, function(note){});
  },
  
  setParentToNullAndNextToParentsNextNote: function(context){
    var next_id = '';
    if (this.parentNote().nextNote()){
      next_id = this.parentNote().nextNote().id();
    }
    context.update_object('Note', {id: this.id(), parent_id: '', next_id: next_id}, {}, function(note){});
  },
   
  setParentsNextPointerToMyself: function(context){
    context.update_object('Note', {id: this.parentNote().id(), next_id: this.id()}, {}, function(note){});
  },
  
  setNextsParentPointerToMyself: function(context){
    context.update_object('Note', {id: this.nextNote().id(), parent_id: this.id()}, {}, function(note){});
  },
  
  insertConflictFields: function(context, overwritten_note_json, conflicting_note_json){
    var this_note = this;
    context.partial('app/templates/notes/solve.mustache', 
      { id: overwritten_note_json._id, 
        my_text: conflicting_note_json.text, 
        overwritten_text: overwritten_note_json.text,
        my_rev: conflicting_note_json._rev,
        overwritten_rev: overwritten_note_json._rev
      }, 
    function(html) {
      console.log('conflict fields sollten hier inserted werden')
      $(html).prependTo(this_note.noteLi());
      context.bindSolveConflictsFocus();
    });
    this_note.note_target.parents('form.edit-note').hide();
  }
}