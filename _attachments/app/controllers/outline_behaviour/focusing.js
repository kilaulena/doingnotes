var Focusing = {
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
  }
}