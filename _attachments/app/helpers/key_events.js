var KeyEvents = {
  happenedOnNoteTarget: function(event){
    return (event.target.tagName == 'TEXTAREA' && $(event.target).attr('class') == 'expanding') ? true : false;
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
  }
}