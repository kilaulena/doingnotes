describe 'NoteElement'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
    // storyboard
    // * 1: first_note  Introduction
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
  
  describe 'constructor'
    it 'should set note_target to the notes textarea'
      first_note.note_target.should.eql first_note_element.find('textarea.expanding:first')
      second_note.note_target.should.eql second_note_element.find('textarea.expanding:first')
    end
    
    it 'should throw an error when no valid selector has been given'
      -{new NoteElement()}.should.throw_error "NoteElement can't be instantiated without a valid note_target"
      -{new NoteElement('bla')}.should.throw_error "NoteElement can't be instantiated without a valid note_target"
      -{new NoteElement($('li:first'))}.should.throw_error "NoteElement can't be instantiated without a valid note_target"
    end
    
    it 'should accept blank note_targets'
      last_note.note_target.should.eql last_note_element.find('textarea.expanding:first')
    end
  end
  
  describe 'id'
    it 'should return the ID of a note'
      first_note.id().should.eql '1'
    end
  end
  
  describe 'text'
    it 'should should return the text of a note'
      first_note.text().should.eql 'Introduction'
    end
  end
  
  describe 'hasChildren()'
    it 'should return true if the note has children'
      first_note.hasChildren().should.be_false
    end
    
    it 'should return false if the note has no children'
      second_note.hasChildren().should.be_true
      child_note.hasChildren().should.be_true
    end
  end
  
  describe 'traversing dom'
    describe 'getting NoteElements'
      describe 'nextNote'
        it 'should return a NoteElement'
          first_note.nextNote().should.be_an_instance_of NoteElement
        end
    
        it 'should return the next note'
          //testing for ids here and not object identity because the context of note_target is different
          first_note.nextNote().id().should.eql '2'
        end
      
        it 'should return null if there is no next note'
          last_note.nextNote().should.be_null
        end
      end
    
      describe 'previousNote'
        it 'should return a note element with the previous note'
          second_note.previousNote().id().should.eql '1'
        end
      
        it 'should return null if there is no previous note'
          first_note.previousNote().should.be_null
        end
      end
    
      describe 'parentNote'
        it 'should return the ID of the parent note'
          child_note.parentNote().id().should.eql '2'
        end
      
        it 'should return null if there is no parent note'
          second_note.parentNote().should.be_null
        end
      end
    
      describe 'firstChildNote'
        it 'should return the ID of the first child note'
          second_note.firstChildNote().id().should.eql '2a'
        end
      
        it 'should return null if there is no child note'
          first_note.firstChildNote().should.be_null
        end
      end
      
      describe 'nextNoteOfClosestAncestor'
        it 'should return the ID of the note after my closest ancestor'
          grandchild_note.nextNoteOfClosestAncestor().id().should.eql '2b'
        end
        
        it 'should return null if there is no such note'
          last_note.nextNoteOfClosestAncestor().should.be_null
        end
      end
      
      describe 'lastChildNoteOfPreviousNote'
        it 'should return the ID of the last descendant note of my previous note'
          last_note.lastChildNoteOfPreviousNote().id().should.eql '2bI'
        end
        
        it 'should return null if there is no such note'
          child_note.lastChildNoteOfPreviousNote().should.be_null
        end
      end
      
      describe 'lastDirectChildNoteOfPreviousNote'
        it 'should return the ID of the last child note of my previous note'
          last_note.lastDirectChildNoteOfPreviousNote().id().should.eql '2b'
        end
        
        it 'should return null if there is no such note'
          child_note.lastDirectChildNoteOfPreviousNote().should.be_null
        end
      end
      
      describe 'firstSiblingNote'
        it 'should return the ID of the first sibling note'
          last_note.firstSiblingNote().id().should.eql '1'
        end
        
        it 'should return null if there is no such note'
          grandchild_note.firstSiblingNote().should.be_null
        end
      end
    end

    describe 'getting lis'
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
    
        it 'should be_undefined when there is no next note in the same level'
          last_note.nextNoteLi().should.be_undefined
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
    
        it 'should be undefined when there is no previous note in the same level'
          first_note.previousNoteLi().should.be_undefined
        end
      end
  
      describe 'parentNoteLi'
        it 'should return the parent li element'
          child_note.parentNoteLi().html().should.eql second_note_element.html()
        end
    
        it 'should also work when parent note has more than one child note'
          second_child_note.parentNoteLi().html().should.eql second_note_element.html()
        end
    
        it 'should also work in another level'
          grandchild_note.parentNoteLi().html().should.eql child_note_element.html()
        end
    
        it 'should be_undefined when there is no parent note'
          first_note.parentNoteLi().should.be_undefined
          second_note.parentNoteLi().should.be_undefined
          last_note.parentNoteLi().should.be_undefined
        end
      end
      
      describe 'firstChildNoteLi'
        it 'should return the first child li element'
          second_child_note.firstChildNoteLi().html().should.eql second_grandchild_note_element.html()
        end
        
        it 'should also work then the note has more than one child note'
          second_note.firstChildNoteLi().html().should.eql child_note_element.html()
        end
        
        it 'should be_undefined when there are no child notes'
          last_note.firstChildNoteLi().should.be_undefined
        end
      end
      
      describe 'nextNoteLiOfClosestAncestor'
        it 'should return the note after my parent li element'
          child_note.nextNoteLiOfClosestAncestor().html().should.eql last_note_element.html()
        end
      
        it 'should return the note after my closest ancestor li element'
          grandchild_note.nextNoteLiOfClosestAncestor().html().should.eql second_child_note_element.html()
        end
        
        it 'should also work when my direct parent has no next note - recursively'
          second_grandchild_note.nextNoteLiOfClosestAncestor().html().should.eql last_note_element.html()
        end
        
        it 'should be_undefined if there is no such note'
          last_note.nextNoteLiOfClosestAncestor().should.be_undefined
        end
      end
      
      describe 'lastChildNoteLiOfPreviousNote'
        it 'should return the last child of my previous note if there is one'
          second_child_note.lastChildNoteLiOfPreviousNote().html().should.eql grandchild_note_element.html()
        end
        
        it 'should return the last grandchild of my previous note - recursively'
          last_note.lastChildNoteLiOfPreviousNote().html().should.eql second_grandchild_note_element.html()
        end
        
        it 'should be_undefined if there is no such note'
          first_note.lastChildNoteLiOfPreviousNote().should.be_undefined
          second_note.lastChildNoteLiOfPreviousNote().should.be_undefined
          child_note.lastChildNoteLiOfPreviousNote().should.be_undefined
          second_grandchild_note.lastChildNoteLiOfPreviousNote().should.be_undefined
        end
      end
      
      describe 'lastDirectChildNoteLiOfPreviousNote'
        it 'should return the last child of my previous note if there is one'
          second_child_note.lastDirectChildNoteLiOfPreviousNote().html().should.eql grandchild_note_element.html()
        end
        
        it 'should not work recursively'
          last_note.lastDirectChildNoteLiOfPreviousNote().html().should.eql second_child_note_element.html()
        end
        
        it 'should be_undefined if there is no such note'
          first_note.lastDirectChildNoteLiOfPreviousNote().should.be_undefined
          second_note.lastDirectChildNoteLiOfPreviousNote().should.be_undefined
          child_note.lastDirectChildNoteLiOfPreviousNote().should.be_undefined
          second_grandchild_note.lastDirectChildNoteLiOfPreviousNote().should.be_undefined
        end
      end
      
      describe 'firstSiblingNoteLi'
        it 'should return the first sibling of the note'
          last_note.firstSiblingNoteLi().html().should.eql first_note_element.html()
        end
        
        it 'should also work in another level'
          second_child_note.firstSiblingNoteLi().html().should.eql child_note_element.html()
        end
        
        it 'should be_undefined if there is no such note'
          first_note.firstSiblingNoteLi().should.be_undefined
        end
      end
    end 
  end
  
  describe 'submitIfChanged'
     before_each 
       note = new NoteElement(first_note_element.find('textarea.expanding:first'))
     end
     
     it 'should submit the form if data attribute is different form the textarea value'
       note.note_target.attr("data-text", 'something')
       note.note_target.val('something completely different')
       note.should.receive('submitForm')
       note.should.receive('setDataText')
       note.submitIfChanged()
     end
     
     it 'should do nothing when data attribute is the same as textareas value'
       note.note_target.attr("data-text", 'something')
       note.note_target.val('something')
       note.submitIfChanged()
       note.note_target.should.have_attr("data-text", 'something')
     end
     
     it 'should also work when the textarea is made blank'
       note.note_target.attr("data-text", 'something')
       note.note_target.val('')
       note.submitIfChanged()
       note.note_target.should.not.have_attr("data-text")
     end
     
     it 'should also work when the textarea is already blank'
       note.note_target.attr("data-text", '')
       note.note_target.val('whatever')
       note.should.receive('submitForm')
       note.should.receive('setDataText')
       note.submitIfChanged()
     end
   end
   
   describe 'setDataText'
     before_each 
       note = new NoteElement($(notes.get(0)).find('textarea.expanding:first'))
     end
     
     it 'should set the data attribute if it is undefined'
       note.note_target.val('something')
       note.setDataText()
       note.note_target.should.have_attr("data-text", 'something')
     end
     
     it 'should do nothing when data attribute already set'
       note.note_target.attr("data-text", 'something')
       note.note_target.val('something else')
       note.setDataText()
       note.note_target.should.have_attr("data-text", 'something')
     end
   end
end