describe 'NoteElement'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
    // storyboard
    // * 1: first_note
    // * 2: second_note
    //   ** 2a: child_note
    //     *** 2aI: grandchild_note 
    //   ** 2b: second_child_note
    //     *** 2bI: second_grandchild_note
    // * 3: last_note
    first_note_element             = $(notes.get(0))
    second_note_element            = $(notes.get(1))
    child_note_element             = $(notes.get(2))
    grandchild_note_element        = $(notes.get(3))
    second_child_note_element      = $(notes.get(4))
    second_grandchild_note_element = $(notes.get(5))
    last_note_element              = $(notes.get(6))
  
    first_note             = new NoteElement(first_note_element.find('textarea.expanding:first'))
    second_note            = new NoteElement(second_note_element.find('textarea.expanding:first'))
    child_note             = new NoteElement(child_note_element.find('textarea.expanding:first'))
    grandchild_note        = new NoteElement(grandchild_note_element.find('textarea.expanding:first'))
    second_child_note      = new NoteElement(second_child_note_element.find('textarea.expanding:first'))
    second_grandchild_note = new NoteElement(second_grandchild_note_element.find('textarea.expanding:first'))
    last_note              = new NoteElement(last_note_element.find('textarea.expanding:first'))
  end
  
  describe 'focusNextTextarea'
    it 'should focus the first child note if there is one'
      second_note.focusNextTextarea();
      second_note.noteLi().should.not.have_attr("data-focus")
      child_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should keep the focus when i dont have a next note and my descendants have no next note'
      last_note.focusNextTextarea();
      last_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should focus the next textarea in the same level if there is one and i have no child notes'
      first_note.focusNextTextarea();
      first_note.noteLi().should.not.have_attr("data-focus")
      second_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should focus the next note of my parent when i dont have child notes'
      grandchild_note.focusNextTextarea();
      grandchild_note.noteLi().should.not.have_attr("data-focus")
      second_child_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should focus the next note of my closest ancestor when i dont have child notes'
      second_grandchild_note.focusNextTextarea();
      second_grandchild_note.noteLi().should.not.have_attr("data-focus")
      last_note.noteLi().attr("data-focus").should.eql 'true'
    end
  end
  
  describe 'focusPreviousTextarea'
    it 'should focus the previous textarea in the same level if there is one and it has no child notes'
      second_note.focusPreviousTextarea();
      second_note.noteLi().should.not.have_attr("data-focus")
      first_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should focus the last child of the previous note if there is one'
      second_child_note.focusPreviousTextarea();
      second_child_note.noteLi().should.not.have_attr("data-focus")
      grandchild_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should focus the last grandchild of the previous note if there is one'
      last_note.focusPreviousTextarea();
      last_note.noteLi().should.not.have_attr("data-focus")
      second_grandchild_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should focus the parent when there is one and it has no child notes'
      child_note.focusPreviousTextarea();
      child_note.noteLi().should.not.have_attr("data-focus")
      second_note.noteLi().attr("data-focus").should.eql 'true'
    end
    
    it 'should keep the focus when i dont have any previous note'
      first_note.focusPreviousTextarea();
      first_note.noteLi().attr("data-focus").should.eql 'true'
    end
  end
end