describe 'NoteElement'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
    // storyboard
    // * 1: first_note
    // * 2: second_note
    //   ** 2a: child_note
    //     *** 2aI: grandchild_note 
    //   ** 2b: second_child_note
    //     *** 2bI: second_grandchild_note
    // * 3: last_note
    first_note_element             = $(notes.get(0))
    second_note_element            = $(notes.get(1))
    child_note_element             = $(notes.get(2))
    grandchild_note_element        = $(notes.get(3))
    second_child_note_element      = $(notes.get(4))
    second_grandchild_note_element = $(notes.get(5))
    last_note_element              = $(notes.get(6))
  
    first_note             = new NoteElement(first_note_element.find('textarea.expanding:first'))
    second_note            = new NoteElement(second_note_element.find('textarea.expanding:first'))
    child_note             = new NoteElement(child_note_element.find('textarea.expanding:first'))
    grandchild_note        = new NoteElement(grandchild_note_element.find('textarea.expanding:first'))
    second_child_note      = new NoteElement(second_child_note_element.find('textarea.expanding:first'))
    second_grandchild_note = new NoteElement(second_grandchild_note_element.find('textarea.expanding:first'))
    last_note              = new NoteElement(last_note_element.find('textarea.expanding:first'))
  end
  
  describe 'insertUpdateNotePointers'
    before_each
      outer_context = {
        update_object: function(Type, attributes, {}, callback){
           this.update_object_attributes = attributes;
         }
      };
      inserted_note = {_id:'4', text: 'inserted!'};
    end
    
    it 'should call setNextPointerToNewlyInsertedNote'
      first_note.should.receive('setNextPointerToNewlyInsertedNote').with_args(outer_context, inserted_note)
      first_note.insertUpdateNotePointers(outer_context, inserted_note);
    end

    it 'should not call setParentPointerOfFirstChildToNewlyInsertedNote if it has no children'
      second_note.should.not.receive('setParentPointerOfFirstChildToNewlyInsertedNote')
      first_note.insertUpdateNotePointers(outer_context, inserted_note);
    end
    
    it 'should call setParentPointerOfFirstChildToNewlyInsertedNote if it has children'
      second_note.should.receive('setParentPointerOfFirstChildToNewlyInsertedNote').with_args(outer_context, inserted_note)
      second_note.insertUpdateNotePointers(outer_context, inserted_note);
    end
    
    it 'should submit the note'
      var outer_context = {
        update_object: function(Type, attributes, {}, callback){
          this.update_object_attributes = attributes;
          this.update_object_callback = callback;
        }
      };
      first_note.insertUpdateNotePointers(outer_context, {_id:'4', text: 'inserted!'});
      outer_context.update_object_callback.should.eql function(json){this_note.submitIfChanged();}
    end
  end
  
  describe 'setNextPointerToNewlyInsertedNote'
    it 'should set the next pointer of this note to the newly inserted note'
      first_note.setNextPointerToNewlyInsertedNote(outer_context, inserted_note);
      outer_context.update_object_attributes.should.eql {id: '1', next_id: '4'}
    end
  end
  
  describe 'setParentPointerOfFirstChildToNewlyInsertedNote'
    it "should set the parent pointer of this notes' first child to the newly inserted note"
      second_note.setParentPointerOfFirstChildToNewlyInsertedNote(outer_context, inserted_note);
      outer_context.update_object_attributes.should.eql {id: '2a', parent_id: '4'}
    end
  end

  describe 'insertNewNote'  
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
    
    it 'should render the edit note partial'
      var outer_context = {
        getOutlineId: function(){return 'storyboard'},
        create_object: function(Type, attributes, {}, callback){
          this.create_object_callback = callback;
        },
        update_object: function(Type, attributes, {}, callback){},
        partial: function(Type, attributes, callback){
          this.partial_attributes = attributes;
        }
      };
      first_note.insertNewNote(outer_context);
      outer_context.create_object_callback({_id:'4', text: 'inserted!'});
      outer_context.partial_attributes.should.eql {_id: '4', text: 'inserted!'}
      outer_context.create_object_callback.toString().should.match /bindSubmitOnBlurAndAutogrow()/
    end
  end
end