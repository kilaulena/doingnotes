describe 'NoteElement'
  describe 'rendering'
    before_each
      outline = elements(fixture('outline'))
      notes = outline.find('li')
      // storyboard
      // * 1: first_note
      // * 2: second_note
      //   ** 2a: child_note
      //     ** 2aI: grandchild_note 
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

      first_note             = new NoteElement(first_note_element.find('textarea:first'))
      second_note            = new NoteElement(second_note_element.find('textarea:first'))
      child_note             = new NoteElement(child_note_element.find('textarea:first'))
      grandchild_note        = new NoteElement(grandchild_note_element.find('textarea:first'))
      second_child_note      = new NoteElement(second_child_note_element.find('textarea:first'))
      second_grandchild_note = new NoteElement(second_grandchild_note_element.find('textarea:first'))
      last_note              = new NoteElement(last_note_element.find('textarea:first'))
      
      notes = new NoteCollection([first_note, second_grandchild_note, last_note, child_note, second_note, second_child_note, grandchild_note]);
    end
  
    describe 'renderNotes'
      it 'should '
        notes.findById = function(){return second_child_note};
        second_child_note.should.receive('renderChildNote', 'once')
        second_child_note.renderNotes({}, notes);
      end
      
    end
  end
end