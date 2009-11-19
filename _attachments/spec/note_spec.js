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
      notes = [
        {_id: "8c8", _rev: "2-188", previous_id: "107", created_at: "2009/10/20 15:04:30 +0000"},
        {_id: "ae9", _rev: "1-148", created_at: "2009/10/23 15:04:00 +0000"},
        {_id: "c03", _rev: "1-345", previous_id: "8c8", created_at: "2009/10/25 15:04:32 +0000"},
        {_id: "107", _rev: "1-325", previous_id: "ae9", created_at: "2009/10/28 15:04:32 +0000"}
      ]
    end
    
    it 'should set the note without previous_id to the beginning'
      sortByPreviousId(notes)[0]._id.should.eql 'ae9'
    end
    
    it 'should set each note directly after the note which has its previous_id as id'
      sortByPreviousId(notes)[1]._id.should.eql '107'
      sortByPreviousId(notes)[2]._id.should.eql '8c8'
      sortByPreviousId(notes)[3]._id.should.eql 'c03'
    end
  end
end