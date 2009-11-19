describe 'Note Helpers'
  describe 'simple sorting'
    before_each
      notes = [
        {_id: "343", _rev: "2-188", type: "Note", created_at: "2009/10/20 15:04:30 +0000", text: "This a note"},
        {_id: "221", _rev: "1-148", type: "Note", created_at: "2009/10/28 15:04:32 +0000", text: "Another note"},
        {_id: "785", _rev: "1-345", type: "Note", created_at: "2009/10/26 15:04:32 +0000", text: "In between"}
      ]
    end
    
    describe 'sort by text'
      it 'should sort notes by text attribute'
        notes = notes.sort(byText)
        notes[0]['text'].should.eql "Another note"
        notes[1]['text'].should.eql "In between"
        notes[2]['text'].should.eql "This a note"
      end
    end
    
    describe 'sort by created at'
      it 'should sort notes by created_at attribute'
        notes = notes.sort(byDate)
        notes[0]['text'].should.eql "This a note"
        notes[1]['text'].should.eql "In between"
        notes[2]['text'].should.eql "Another note"
      end
    end
  end  
  
  describe 'sortByPreviousId()'
    before_each
      note3 = new Note({_id: "8c8", text: 'three', _rev: "2-188", previous_id: "107", created_at: "2009/10/20 15:04:30 +0000"});
      note1 = new Note({_id: "ae9", text: 'one', _rev: "1-148", created_at: "2009/10/23 15:04:00 +0000"});
      note4 = new Note({_id: "c03", text: 'four', _rev: "1-345", previous_id: "8c8", created_at: "2009/10/25 15:04:32 +0000"});
      note2 = new Note({_id: "107", text: 'two', _rev: "1-325", previous_id: "ae9", created_at: "2009/10/28 15:04:32 +0000"});
        
      notes = [note3, note1, note4, note2];
    end
    
    it 'should set the note without previous_id to the beginning'
      sortByPreviousId(notes)[0]._id.should.eql note1._id
    end
    
    it 'should return an array of notes'
      sortByPreviousId(notes)[3].should.be_an_instance_of Note
    end
    
    it 'should return an array that has as many elements as the unsorted array'
      sortByPreviousId(notes).should.have_length notes.length
    end
    
    it 'should set each note directly after the note which has its previous_id as id'
      var sorted_notes = sortByPreviousId(notes)
      sorted_notes[0]._id.should.eql note1._id
      sorted_notes[1]._id.should.eql note2._id
      sorted_notes[2]._id.should.eql note3._id
      sorted_notes[3]._id.should.eql note4._id
    end
    
    it 'should should throw an error if there is more than one note without previous id'
      note5 = new Note({_id: "fff", _rev: "2-420", created_at: "2009/10/25 15:04:32 +0000"});
      notes.push(note5);
      -{sortByPreviousId(notes)}.should.throw_error 'There is more than one note without a previous_id'
    end
    
    describe 'findNextNote()'
      it 'should return one note'
        note1.findNextNote(notes).should.be_an_instance_of Note
      end
  
      it 'should return the note which has the id of the note it was called on as previous_id'
        note2.findNextNote(notes)._id.should.eql note3._id
      end
      
      it 'should return nothing when there is no note which has id as previous_id'
        note4.findNextNote(notes).should.be_undefined
      end
      
      it 'should throw an error if there is more than one note with the same previous id'
        note5 = new Note({_id: "fff", _rev: "2-420", previous_id: "8c8", created_at: "2009/10/25 15:04:32 +0000"});
        notes.push(note5);
        -{note3.findNextNote(notes)}.should.throw_error 'There is more than one note with previous_id "8c8"'
      end
    end
  end
end