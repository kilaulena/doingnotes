describe 'Outline'
  describe 'simple sorting'
    before_each
      outline3 = new Outline({_id: "8c8", title: 'three', _rev: "2-188", created_at: "2009/10/21 15:04:30 +0000"});
      outline1 = new Outline({_id: "ae9", title: 'one',   _rev: "1-148", created_at: "2009/10/20 15:04:00 +0000"});
      outline4 = new Outline({_id: "c03", title: 'four',  _rev: "1-345", created_at: "2009/10/25 15:04:32 +0000"});
      outline2 = new Outline({_id: "107", title: 'two',   _rev: "1-325", created_at: "2009/10/21 13:04:32 +0000"});

      outlines = [outline3, outline1, outline4, outline2];
    end
  
    describe 'sort by created at'
      it 'should sort notes by created_at attribute'
        outlines = outlines.sort(byDate);
        outlines[0]['title'].should.eql "one"
        outlines[1]['title'].should.eql "two"
        outlines[2]['title'].should.eql "three"
        outlines[3]['title'].should.eql "four"
      end
    end
  end
end