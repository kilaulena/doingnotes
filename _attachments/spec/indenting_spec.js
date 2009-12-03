describe 'NoteElement'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
    // storyboard
    // * 1: first_note
    // * 2: second_note
    //   ** 2a: child_note
    //   ** 2b: second_child_note
    //     *** 2bI: grandchild_note
    // * 3: last_note
    first_note_element        = $(notes.get(0))
    second_note_element       = $(notes.get(1))
    child_note_element        = $(notes.get(2))
    second_child_note_element = $(notes.get(3))
    grandchild_note_element   = $(notes.get(4))
    last_note_element         = $(notes.get(5))
  
    first_note        = new NoteElement(first_note_element.find('textarea:first'))
    second_note       = new NoteElement(second_note_element.find('textarea:first'))
    child_note        = new NoteElement(child_note_element.find('textarea:first'))
    second_child_note = new NoteElement(second_child_note_element.find('textarea:first'))
    grandchild_note   = new NoteElement(grandchild_note_element.find('textarea:first'))
    last_note         = new NoteElement(last_note_element.find('textarea:first'))
  end
  
  describe 'indent'  
  
  end  
end
  