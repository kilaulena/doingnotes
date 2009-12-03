describe 'NoteElement'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
  end
  
  describe 'getIdFromDom'
    it 'should return the ID of a note'
      note = new NoteElement($(notes.get(0)).find('textarea:first'))
      note.getIdFromDom().should.eql '1'
    end
  end
  
  describe 'submitIfChanged'
    before_each 
      note = new NoteElement($(notes.get(0)).find('textarea:first'))
    end
    
    it 'should remove the data attribute if it is different form the textarea value'
      note.note_target.attr("data-text", 'something')
      note.note_target.val('something completely different')
      note.submitIfChanged()
      note.note_target.should.not.have_attr("data-text")
    end
    
    it 'should do nothing when data attribute is the same as textareas value'
      note.note_target.attr("data-text", 'something')
      note.note_target.val('something')
      note.submitIfChanged()
      note.note_target.should.have_attr("data-text", 'something')
    end
  end

  describe 'getting li elements'
    before_each
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
  
    describe 'constructor'
      it 'should set note_target to the notes textarea'
        first_note.note_target.should.eql first_note_element.find('textarea:first')
        second_note.note_target.should.eql second_note_element.find('textarea:first')
      end
    end

    describe 'noteLi'
      it 'should return the li element around the target'
       first_note.noteLi().html().should.eql first_note_element.html()
      end
    end
  
    describe 'nextNoteLi'
      it 'should return the next li element in the same level'
        first_note.nextNoteLi().html().should.eql second_note_element.html()
      end
    
      it 'should also work when note has child notes'
        second_note.nextNoteLi().html().should.eql last_note_element.html()
      end
    
      it 'should also work in another level'
        child_note.nextNoteLi().html().should.eql second_child_note_element.html()
      end
    
      it 'should return null when there is no next note in the same level'
        last_note.nextNoteLi().html().should.be_null
      end
    end
  
    describe 'previousNoteLi'
      it 'should return the previous li element in the same level'
        second_note.previousNoteLi().html().should.eql first_note_element.html()
      end
    
      it 'should also work when previous note has child notes'
        last_note.previousNoteLi().html().should.eql second_note_element.html()
      end
    
      it 'should also work in another level'
        second_child_note.previousNoteLi().html().should.eql child_note_element.html()
      end
    
      it 'should return null when there is no previous note in the same level'
        first_note.previousNoteLi().html().should.be_null
      end
    end
  
    describe 'parentNoteLi'
      it 'should return the parent li element'
        child_note.parentNoteLi().html().should.eql second_note_element.html()
      end
    
      it 'should also work when parent note has more child notes'
        second_child_note.parentNoteLi().html().should.eql second_note_element.html()
      end
    
      it 'should also work in another level'
        grandchild_note.parentNoteLi().html().should.eql second_child_note_element.html()
      end
    
      it 'should return null when there is no parent note'
        first_note.parentNoteLi().html().should.be_null
        second_note.parentNoteLi().html().should.be_null
        last_note.parentNoteLi().html().should.be_null
      end
    end
  end
end