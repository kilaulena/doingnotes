describe 'NoteElement'
  before_each
    outline = elements(fixture('outline'))
    notes = outline.find('li')
    // storyboard
    // * 1: first_note
    // * 2: second_note
    //   ** 2a: child_note
    //     ** 2aI: grandchild_note 
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

    first_note             = new NoteElement(first_note_element.find('textarea:first'))
    second_note            = new NoteElement(second_note_element.find('textarea:first'))
    child_note             = new NoteElement(child_note_element.find('textarea:first'))
    grandchild_note        = new NoteElement(grandchild_note_element.find('textarea:first'))
    second_child_note      = new NoteElement(second_child_note_element.find('textarea:first'))
    second_grandchild_note = new NoteElement(second_grandchild_note_element.find('textarea:first'))
    last_note              = new NoteElement(last_note_element.find('textarea:first'))
  end
  
  describe 'indenting'
    describe 'unindent'
      before_each
        outer_context = {
          update_object: function(Type, attributes, {}, callback){
             this.update_object_attributes = attributes;
           }
        };
      end
      
      it 'should focus the current note'
        second_note.unIndent(outer_context);
        second_note.noteLi().attr("data-focus").should.eql 'true'
      end
      
      describe 'no parent note'
        // it 'should not update anything'
        //    first_note.indent(outer_context);
        //    outer_context.update_object_attributes.should.be_null
        //  end
        // 
        //  it 'should not update anything even when there is a parent note'
        //    child_note.indent(outer_context);
        //    outer_context.update_object_attributes.should.be_null
        //  end
        // 
        //  it 'should not change the dom'
        //    child_note.indent(outer_context);
        //    second_note.nextNote().id().should.eql '3'
        //    child_note.parentNote().id().should.eql '2'
        //  end
      end
      
      describe 'parent note'
        // it 'should update notes'
        //   second_note.indent(outer_context);
        //   outer_context.update_object_attributes.should.not.be_null
        // end
        // 
        // it 'should change the dom'
        //   second_note.indent(outer_context);
        //   second_note.parentNote().id().should.eql '1'
        //   first_note.nextNote().id().should.eql '3'
        // end
      end
    end
    
    describe 'indentUpdateNotePointers'
      before_each
        outer_context = {
          update_object: function(Type, attributes, {}, callback){
             this.update_object_attributes = attributes;
           }
        }
      end
      
      //   describe 'setParentNextPointerToMyself'
      //     it 'should set the next pointer of my parent note to myself'       
      //     end
      //   end
      //   
      //   describe 'setParentToNull'
      //     it 'should my parent pointer to null'
      //     end
      //   end
   end    

    describe 'unIndentNoteInDom'
    //     describe 'i have child notes and a next note'
    //       it 'should set the next note after my last child note to my next note'
    //         
    //       end
    //     end
    end
  end 
end
