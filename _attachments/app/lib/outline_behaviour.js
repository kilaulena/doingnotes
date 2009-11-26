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
      if(element.closest('li').next().length > 0){
        return context.getNoteId(element.closest('li').next().find('textarea'));
      };
    },
    
    getPreviousNoteId: function(context, element){
      if(element.closest('li').prev().length > 0){
        return context.getNoteId(element.closest('li').prev().find('textarea'));
      };
    },
    
    getParentNoteId: function(context, element){
      if(element.closest('ul.indent').length > 0){
        return context.getNoteId(element.closest('li').find('textarea'));
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
      var context = this;
      if (target.parent().parent().next().find('textarea').length > 0){
        var element = target.parent().parent().next().find('textarea:first');
        console.log(element);
      } else {
        console.log('rewrite with parent id')
        var parent_id = context.getParentNoteId(context, target);
        
        var element = target.parent().parent().parent().parent().next().find('textarea');
        console.log(target.closest('ul'));
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
          $(html).insertAfter(target.closest('li')).find('textarea').focus();
          context.bindSubmitOnBlurAndAutogrow();
          $('#spinner').hide(); 
        });
      });
    },
    
    updateNotePointers: function(context, target_id, previous_id, next_id){
      if(typeof(previous_id)!="undefined"){
        //if this is not the first note, set the previous note's pointer to the note after myself
        context.update_object('Note', {id: previous_id, next_id: next_id}, {}, function(note){});
      }
      //set my next_id to null, my parent is my former previous note
      context.update_object('Note', {id: target_id, next_id: '', parent_id: previous_id}, {}, function(note){});
    },
    
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

    }
  });
};