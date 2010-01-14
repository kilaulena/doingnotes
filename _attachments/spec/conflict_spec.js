describe 'NoteElement'
  before_each
    outline = elements(fixture('outline-conflicts'))
    notes = outline.find('li')
    // storyboard
    // * 1: first_note  - Introduction
    // * 2: second_note - Main Part
    // * 3: conflict_note - Pizza / Pasta
    // * 4: last_note 
    first_note_element    = $(notes.get(0))
    second_note_element   = $(notes.get(1))
    conflict_note_element = $(notes.get(2))
    last_note_element     = $(notes.get(3))

    first_note    = new NoteElement(first_note_element.find('textarea.expanding:first'))
    second_note   = new NoteElement(second_note_element.find('textarea.expanding:first'))
    conflict_note = new NoteElement(conflict_note_element.find('textarea.expanding:first'))
    last_note     = new NoteElement(last_note_element.find('textarea.expanding:first'))
  end

  describe 'noteTarget'
    it 'should return the note_target if it is visible'
      first_note.noteTarget().should.eql first_note.note_target
      first_note.noteTarget().val().should.eql "Introduction"
    end
    
    it 'should return the first solve_text textarea if note_target is hidden'
      conflict_note.noteTarget().val().should.eql "Pizza"
    end
  end
end