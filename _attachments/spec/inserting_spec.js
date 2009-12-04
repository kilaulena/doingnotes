describe 'NoteElement'
  describe 'insertNewNote'  
    before_each
      outline = elements(fixture('outline'))
      notes = outline.find('li')
      first_note        = new NoteElement($(notes.get(0)).find('textarea:first'))
      second_note       = new NoteElement($(notes.get(1)).find('textarea:first'))
      last_note         = new NoteElement($(notes.get(5)).find('textarea:first'))
    end
    
    it 'should call create_object without next_id whent there is no next node'
      var outer_context = {
        getOutlineId: function(){return 'storyboard'},
        create_object: function(Type, attributes, {}, callback){
           this.create_object_attributes = attributes;
         }
      };
      last_note.insertNewNote(outer_context);
      outer_context.create_object_attributes.should.eql {text: '', outline_id: 'storyboard'}
    end
  
    it 'should call create_object with the next_id when there is a next node'
      var outer_context = {
        getOutlineId: function(){return 'storyboard'},
        create_object: function(Type, attributes, {}, callback){
          this.create_object_attributes = attributes;
        }
      };
      first_note.insertNewNote(outer_context);
      outer_context.create_object_attributes.should.eql {text: '', outline_id: 'storyboard', next_id: '2'}
    end
    
    it 'should call update_object'
      var outer_context = {
        getOutlineId: function(){return 'storyboard'},
        create_object: function(Type, attributes, {}, callback){
          this.create_object_callback = callback;
        },
        update_object: function(Type, attributes, {}, callback){
          this.update_object_attributes = attributes;
          this.update_object_callback = callback;
        },
        partial: function(Type, attributes, {}, callback){}
      };
      first_note.insertNewNote(outer_context);
      outer_context.create_object_callback({id:'4'});
      outer_context.update_object_attributes.should.eql {id: '1', next_id: '4'}
      outer_context.update_object_callback.should.eql function(json){this_note.submitIfChanged();}
    end
  
    it 'should render the edit note partial'
      var outer_context = {
        getOutlineId: function(){return 'storyboard'},
        create_object: function(Type, attributes, {}, callback){
          this.create_object_callback = callback;
        },
        update_object: function(Type, attributes, {}, callback){},
        partial: function(Type, attributes, callback){
          this.partial_attributes = attributes;
          this.partial_callback = callback;
        }
      };
      first_note.insertNewNote(outer_context);
      outer_context.create_object_callback({id:'4'});
      outer_context.partial_attributes.should.eql {_id: '4'}
      outer_context.partial_callback.toString().should.match /bindSubmitOnBlurAndAutogrow()/
    end
  end
end