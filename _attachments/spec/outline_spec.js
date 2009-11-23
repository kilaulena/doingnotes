describe 'outline_behaviour'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
  end
  
  describe 'getNoteId()'
    it 'should get the id of a note'
      first_note = notes.get(0);
      first_note.should.have_class 'edit-note'
      // sammy.getNoteId(first_note).should.eql '123'
    end
  end
end