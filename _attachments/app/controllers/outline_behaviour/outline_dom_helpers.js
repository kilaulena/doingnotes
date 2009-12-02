var OutlineDomHelpers = {
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
  
  getOutlineId: function(context){
    return context.$element().find('h2#outline-id').html();
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
      return context.getNoteId(element.parents('li:first').find('textarea'));
    };
  }
}