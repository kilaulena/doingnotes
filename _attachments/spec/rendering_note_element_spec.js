describe 'NoteElement'
  describe 'rendering'
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
      
      first_note_object             = new Note({_id: '1', next_id: '2', first_note: true})
      second_note_object            = new Note({_id: '2', next_id: '3', text: 'more text'})
      child_note_object             = new Note({_id: '2a', next_id: '2b', parent_id: '2'})
      grandchild_note_object        = new Note({_id: '2aI', parent_id: '2a'})
      second_child_note_object      = new Note({_id: '2b'})
      second_grandchild_note_object = new Note({_id: '2bI', parent_id: '2b', text: 'some text'})
      last_note_object              = new Note({_id: '3'})
      
      notes = new NoteCollection([first_note_object, second_grandchild_note_object, last_note_object, 
        child_note_object, second_note_object, second_child_note_object, grandchild_note_object]);
    end
    
    describe 'renderNotes'
      before_each
        outer_context = {
          partial: function(Kind, attributes, callback){
            this.partial_attributes = attributes;
          },
          bindSubmitOnBlurAndAutogrow: function(){},
          unbindSubmitOnBlurAndAutogrow: function(){}
        };
      end  
      
      describe 'note has a child note' 
        it 'should call renderFollowingNote with the child_note'
          var second_grandchild_note_object = second_child_note_object.firstChildNoteObject(notes.notes)
          second_child_note.should.receive('renderFollowingNote').with_args(outer_context, second_grandchild_note_object, function(child){child.renderNotes(context, notes)})
          second_child_note.renderNotes(outer_context, notes);
        end
        
        it 'should call the partial with the child note values'
          second_child_note.renderNotes(outer_context, notes);
          outer_context.partial_attributes.should.eql({_id: '2bI', text: 'some text'});
        end
      end

      describe 'note has a next note'
        it 'should call renderFollowingNote with the next_note'
          var next_note_object = first_note_object.nextNoteObject(notes.notes)
          first_note.should.receive('renderFollowingNote').with_args(outer_context, next_note_object, function(next){next.renderNotes(context, notes)})
          first_note.renderNotes(outer_context, notes);
        end
        
        it 'should call the partial with the next note values'
          first_note.renderNotes(outer_context, notes);
          outer_context.partial_attributes.should.eql({_id: '2', text: 'more text'});
        end
      end
      
      describe 'note has neither next note nor child note'
        it 'should not call renderFollowingNote'
          last_note.should.not.receive('renderFollowingNote')
          last_note.renderNotes(outer_context, notes);
        end
      end
      
      describe 'note has both next note and child note'
        it 'should call renderFollowingNote with the child_note'
          child_note.should.receive('renderFollowingNote', 'twice')
          child_note.renderNotes(outer_context, notes);
        end
      end
    end
  end
end