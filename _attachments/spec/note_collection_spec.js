describe 'NoteCollection'
  before_each
    note3 = new Note({_id: "8c8", text: 'three', _rev: "2-188", created_at: "2009/10/20 15:04:30 +0000"});
    note1 = new Note({_id: "ae9", text: 'one', _rev: "1-148", next_id: "107", first_note: true, created_at: "2009/10/23 15:04:00 +0000"});
    note2 = new Note({_id: "107", text: 'two', _rev: "1-325", next_id: "8c8", created_at: "2009/10/28 15:04:32 +0000"});
      
    notes = new NoteCollection([note3, note1, note2]);
  end
  
  describe 'firstNote'
    it 'should return a note'
      notes.firstNote().should.be_an_instance_of Note
    end
    
    it 'should return the first note'
      notes.firstNote()._id.should.eql note1._id
    end

    it 'should throw an error if there is more than one note that could be the first note'
      note4 = new Note({_id: "fff", _rev: "2-420", first_note: true, created_at: "2009/10/25 15:04:32 +0000"});
      notes.notes.push(note4);
      -{notes.firstNote()}.should.throw_error 'More than one first note found'
    end  
  end
  
  describe 'findById'
    it 'should return a note'
      notes.findById('107').should.be_an_instance_of Note
    end
    
    it 'should return the note with the passed in note'
      notes.findById('107')._id.should.eql '107'
      notes.findById('8c8')._id.should.eql '8c8'
    end
    
    it 'should return undefined when no note with id found'
      notes.findById('0815').should.be_undefined
    end
  end
end
