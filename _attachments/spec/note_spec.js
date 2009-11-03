describe 'Note Helpers'
  describe 'sorting'
    before_each
      notes = [
        {_id: "8c8", _rev: "2-188", type: "Note", created_at: "2009/10/20 15:04:30 +0000", text: "This a note", updated_at: "\"Mon Oct 26 16:04:36 +0100 2009\""},
        {_id: "ae9", _rev: "1-148", type: "Note", created_at: "2009/10/28 15:04:32 +0000", text: "Another note"},
        {_id: "c03", _rev: "1-345", type: "Note", created_at: "2009/10/26 15:04:32 +0000", text: "In between"}
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
      it 'should sort notes by text attribute'
        notes = notes.sort(byDate)
        notes[0]['text'].should.eql "This a note"
        notes[1]['text'].should.eql "In between"
        notes[2]['text'].should.eql "Another note"
      end
    end
  end  
end