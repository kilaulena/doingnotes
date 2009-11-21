OutlineBehaviour = function(sammy) {  
  sammy.helpers({
    happenedOnNote: function(event){
      return (event.target.tagName == 'TEXTAREA' && $(event.target).attr('class', 'expanding'));
    },

    enterPressed: function(event) {
      return (event.keyCode == 13 && event.shiftKey == false);
    },

    keyUpPressed: function(event) {
      return (event.keyCode == 38 && event.shiftKey == false);
    },

    keyDownPressed: function(event) {
      return (event.keyCode == 40 && event.shiftKey == false);
    },

    tabPressed: function(event) {
      return (event.keyCode == 9 && event.shiftKey == false);
    },

    tabShiftPressed: function(event) {
      return (event.keyCode == 9 && event.shiftKey == true);
    },

    submitIfChanged: function(target) {
      if(target.attr("data-text") != target.val()) {
        target.removeAttr("data-text");
        target.parent('form').submit();
      }
    },

    updateNotePointers: function(context, target_id, previous_id, next_id){
      if(typeof(previous_id)!="undefined"){
        //if this is not the first note, set the previous note's pointer to the note after myself
        context.update_object('Note', {id: previous_id, next_id: next_id}, {}, function(note){});
      }
      //set my next_id to null, my parent is my former previous note
      context.update_object('Note', {id: target_id, next_id: '', parent_id: previous_id}, {}, function(note){});
    },
    
    bindSubmitOnBlurAndAutogrow: function(){
      var context = this;
      $('textarea.expanding').autogrow();
      $('textarea.expanding').bind('blur', function(e) {
        context.submitIfChanged($(e.target));
      });
    },
    
    getNoteId: function(element){
      return element.attr('id').match(/edit_text_(\w*)/)[1];
    },
    
    getNextNoteId: function(context, element){
      if(element.parent().parent().next().length > 0){
        return context.getNoteId(element.parent().parent().next().find('textarea'));
      };
    },
    
    getPreviousNoteId: function(context, element){
      if(element.parent().parent().prev().length > 0){
        return context.getNoteId(element.parent().parent().prev().find('textarea'));
      };
    },
    
    focusPreviousTextarea: function(target){
      if (target.parent().parent().prev().find('textarea').length > 0){
        var element = target.parent().parent().prev().find('textarea');
      } else {
        var element = target.parent().parent().parent().parent().prev().find('textarea');
      }
      element.focus();
    },
    
    focusNextTextarea: function(target){
      if (target.parent().parent().next().find('textarea').length > 0){
        var element = target.parent().parent().next().find('textarea:first');
      } else {
        var element = target.parent().parent().parent().parent().next().find('textarea');
      }
      element.focus();
    },
    
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
          $(html).insertAfter(target.parent().parent()).find('textarea').focus();
          context.bindSubmitOnBlurAndAutogrow();
          $('#spinner').hide(); 
        });
      });
    },
    
    indent: function(target){
      var context = this;  
      var target_id = context.getNoteId(target);
      var previous_id = context.getPreviousNoteId(context, target);
      var next_id = context.getNextNoteId(context, target);

      if(target.parent().parent().prev().children().is('ul.indent')){
        context.updateNotePointers(context, target_id, previous_id, next_id);
        target.parent().parent().prev().children().append(target.parent().parent());
        target.parent().parent().prev().next().find('textarea').focus();
        
      } else if(target.parent().parent().next().children().is('ul.indent')){
        context.updateNotePointers(context, target_id, previous_id, next_id);
        target.parent().parent().next().children().prepend(target.parent().parent());   
        target.parent().parent().next().prev().find('textarea').focus();
               
      } else if(target.parent().parent().prev().children().is('form')) {
        context.updateNotePointers(context, target_id, previous_id, next_id);
        target.parent().parent().wrap('<li><ul class="indent"></ul></li>');
        target.parent().parent().find('textarea').focus();
      }
    },
    
    unindent: function(target){
      
    }
  });
};