describe 'Note Helpers'
  describe 'constructor'
    it 'should create a note from an attributes hash'
      note = new Note({_id: "ae9", text: 'one', _rev: "1-148", next_id: "107", created_at: "2009/10/23 15:04:00 +0000"});
      note.should.be_an_instance_of Note
    end
    
    it 'should assign the values'
      note = new Note({_id: "ae9", text: 'one', _rev: "1-148", next_id: "107", created_at: "2009/10/23 15:04:00 +0000"});
      note._id.should.eql "ae9"
      note.text.should.eql "one"
      note.next_id.should.eql "107"
    end
  end

  describe 'nextNoteObject'
    before_each
       note3 = new Note({_id: "8c8", text: 'three', _rev: "2-188", next_id: "c03"});
       note1 = new Note({_id: "ae9", text: 'one', _rev: "1-148", next_id: "107"});
       note4 = new Note({_id: "c03", text: 'four', _rev: "1-345"});
       note2 = new Note({_id: "107", text: 'two', _rev: "1-325", next_id: "8c8"});

       notes = [note3, note1, note4, note2];
     end
    
    it 'should return a Note'
      note1.nextNoteObject(notes).should.be_an_instance_of Note
    end
      
    it 'should return the next note'
      note1.nextNoteObject(notes)._id.should.eql note2._id
      note2.nextNoteObject(notes)._id.should.eql note3._id
      note3.nextNoteObject(notes)._id.should.eql note4._id
    end
    
    it 'should return undefined when it has no next_id'
      note4.nextNoteObject(notes).should.be_undefined
    end
  end
  
  describe 'firstChildNoteObject'
    before_each
      first        = new Note({_id: "8c8", text: 'first', next_id: "ae9", created_at: "2009/10/20 15:04:30 +0000"});
      second       = new Note({_id: "ae9", text: 'second', next_id: "d44", created_at: "2009/10/23 15:04:00 +0000"});
      child        = new Note({_id: "c03", text: 'child', next_id: "107", parent_id: "ae9", created_at: "2009/10/25 15:04:32 +0000"});
      second_child = new Note({_id: "107", text: 'second_child', created_at: "2009/10/28 15:04:32 +0000"});
      last         = new Note({_id: "d44", text: 'last', created_at: "2009/10/28 15:04:32 +0000"});
      
      notes = [second, second_child, first, last, child];
    end
    
    it 'should return a note'
      second.firstChildNoteObject(notes).should.be_an_instance_of Note
    end
    
    it 'should return undefined when note has no child notes'
      first.firstChildNoteObject(notes).should.be_undefined
      last.firstChildNoteObject(notes).should.be_undefined
      child.firstChildNoteObject(notes).should.be_undefined
    end
    
    it 'should return the first child note'
      second.firstChildNoteObject(notes)._id.should.eql child._id
    end
    
    it 'should throw an error when there is more than one first child note'
      claims_to_be_child = new Note({_id: "666", text: 'claims to be child', parent_id: "ae9", created_at: "2009/10/25 15:04:32 +0000"});
      notes.push(claims_to_be_child);
      -{second.firstChildNoteObject(notes)}.should.throw_error 'More than one first child note for "ae9" found'
    end
  end
end