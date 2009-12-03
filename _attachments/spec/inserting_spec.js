describe 'NoteElement'
  describe 'insertNewNote'  
    before_each
      outline = elements(fixture('outline'))
      notes = outline.find('li')
      first_note        = new NoteElement($(notes.get(0)).find('textarea:first'))
      second_note       = new NoteElement($(notes.get(1)).find('textarea:first'))
      last_note         = new NoteElement($(notes.get(5)).find('textarea:first'))
    end
    
    it 'should call create_object whent there is no next node'
      var context = {
        getOutlineId: function(){return 'storyboard'},
        nextNote: function(){return null},
        create_object: function(Type, attributes, callback){
          this.create_objects_attributes = attributes;
        }
      }; 
      last_note.insertNewNote.call(context);
      context.create_objects_attributes.should.eql {text: '', outline_id: 'storyboard'}
    end
  
    it 'should call create_object with the next_id when there is a next node'
      var context = {
        getOutlineId: function(){return 'storyboard'},
        nextNote: function(){return second_note},
        id: function(){return '2'},
        create_object: function(Type, attributes, callback){
          this.create_objects_attributes = attributes;
        }
      }; 
      first_note.insertNewNote.call(context);
      context.create_objects_attributes.should.eql {text: '', outline_id: 'storyboard', next_id: '2'}
    end
  end
end