var OutlineHelpers = {
  bindSubmitOnBlurAndAutogrow: function(){
    var context = this;
    $('textarea.expanding').autogrow();
    $('textarea.expanding').bind('blur', function(e) {
      context.submitIfChanged($(e.target));
    });
  },
  
  getOutlineId: function(){
    return this.$element().find('h2#outline-id').html();
  }
}