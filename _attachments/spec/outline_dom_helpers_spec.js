describe 'outline_dom_helpers'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
    // * 1: first_note
    // * 2: 
    //   ** 2a: child_note
    //   ** 2b: second_child_note
    //     *** 2bI: grandchild_note
    // * 3: last_note
    first_note = $(notes.get(0));
    child_note = $(notes.get(2));
    second_child_note = $(notes.get(3))
    grandchild_note = $(notes.get(4))
    last_note = $(notes.get(5));
  end
  
  describe 'getNoteId()'
    it 'should return the ID of a note when passed in a textarea'
      OutlineHelpers.getNoteId(first_note.find('textarea')).should.eql '1'
    end
  end
  
  describe 'getNextNoteId()'
    it 'should return the ID of the next note in the same level'
      OutlineHelpers.getNextNoteId(OutlineHelpers, first_note).should.eql '2'
    end
    
    it 'should also work in another level'
      OutlineHelpers.getNextNoteId(OutlineHelpers, child_note).should.eql '2b'
    end
    
    it 'should return undefined when there is no next note in the same level'
      OutlineHelpers.getNextNoteId(OutlineHelpers, last_note).should.be_undefined
    end
  end
  
  describe 'getPreviousNoteId()'
    it 'should return the ID of the previous note in the same level'
      OutlineHelpers.getPreviousNoteId(OutlineHelpers, last_note).should.eql '2'
    end
    
    it 'should also work in another level'
      OutlineHelpers.getPreviousNoteId(OutlineHelpers, second_child_note).should.eql '2a'
    end
    
    it 'should return undefined when there is no previous note in the same level'
      OutlineHelpers.getPreviousNoteId(OutlineHelpers, first_note).should.be_undefined
    end
  end
  
  describe 'getParentNoteId()'
    it 'should return the ID of the parent note'
      OutlineHelpers.getParentNoteId(OutlineHelpers, child_note).should.eql '2'
      OutlineHelpers.getParentNoteId(OutlineHelpers, second_child_note).should.eql '2'
    end
    
    it 'should also work for grandchild notes'
      OutlineHelpers.getParentNoteId(OutlineHelpers, grandchild_note).should.eql '2b'
    end
    
    it 'should return undefined when it has no parent note'
      OutlineHelpers.getParentNoteId(OutlineHelpers, first_note).should.be_undefined
    end
  end
end