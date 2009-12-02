describe 'inserting'  
  it 'should call create_object'
    var context = {
      getOutlineId: function(){return 'storyboard'},
      getNoteId: function(){return '3'},
      getNextNoteId: function(){return undefined},
      create_object: function(Type, attributes, callback){
        this.create_objects_attributes = attributes;
      }
    }; 
    Inserting.insertAndFocusNewNoteAndSubmit.call(context, 'note_without_next');
    context.create_objects_attributes.should.eql {text: '', outline_id: 'storyboard'}
  end
  
  it 'should call create_object with the next_id'
    var context = {
      getOutlineId: function(){return 'storyboard'},
      getNoteId: function(){return '1'},
      getNextNoteId: function(){return '2'},
      create_object: function(Type, attributes, callback){
        this.create_objects_attributes = attributes;
      }
    }; 
    Inserting.insertAndFocusNewNoteAndSubmit.call(context, 'note_with_next');
    context.create_objects_attributes.should.eql {text: '', outline_id: 'storyboard', next_id: '2'}
  end
end