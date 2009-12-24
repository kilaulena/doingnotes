describe 'NoteElement'
  before_each
    outline = elements(fixture('outline-unindent'))
    notes = outline.find('li')
    // storyboard
    // * 1: first_note
    // * 2: second_note
    //   ** 2a: child_note
    //     *** 2aI: grandchild_note 
    //   ** 2b: second_child_note
    //     *** 2bI: second_grandchild_note
    //     *** 2bII: third_grandchild_note
    //     *** 2bIII: fourth_grandchild_note
    // * 3: last_note
    first_note_element             = $(notes.get(0))
    second_note_element            = $(notes.get(1))
    child_note_element             = $(notes.get(2))
    grandchild_note_element        = $(notes.get(3))
    second_child_note_element      = $(notes.get(4))
    second_grandchild_note_element = $(notes.get(5))
    third_grandchild_note_element  = $(notes.get(6))
    fourth_grandchild_note_element = $(notes.get(7))
    last_note_element              = $(notes.get(8))

    first_note             = new NoteElement(first_note_element.find('textarea:first'))
    second_note            = new NoteElement(second_note_element.find('textarea:first'))
    child_note             = new NoteElement(child_note_element.find('textarea:first'))
    grandchild_note        = new NoteElement(grandchild_note_element.find('textarea:first'))
    second_child_note      = new NoteElement(second_child_note_element.find('textarea:first'))
    second_grandchild_note = new NoteElement(second_grandchild_note_element.find('textarea:first'))
    third_grandchild_note  = new NoteElement(third_grandchild_note_element.find('textarea:first'))
    fourth_grandchild_note = new NoteElement(fourth_grandchild_note_element.find('textarea:first'))
    last_note              = new NoteElement(last_note_element.find('textarea:first'))
  end
  
  describe 'unindenting'
    describe 'unindent'
      before_each
        outer_context = {
          update_object: function(Type, attributes, {}, callback){
            this.update_object_attributes = attributes;
          }
        }
      end
      
      it 'should focus the current note'
        grandchild_note.unindent(outer_context);
        grandchild_note.noteLi().attr("data-focus").should.eql 'true'
      end
      
      describe 'in the first level'
        it 'should not update anything'
           first_note.unindent(outer_context);
           outer_context.update_object_attributes.should.be_null
           second_note.unindent(outer_context);
           outer_context.update_object_attributes.should.be_null
           last_note.unindent(outer_context);
           outer_context.update_object_attributes.should.be_null
         end
        
         it 'should not change the dom'
           second_note.unindent(outer_context);
           second_note.nextNote().id().should.eql '3'
           second_note.previousNote().id().should.eql '1'
         end
      end
      
      describe 'has a parent'
        // it 'should update notes'
        //   grandchild_note.unindent(outer_context);
        //   outer_context.update_object_attributes.should.not.be_null
        // end
        
        it 'should change the dom'
          grandchild_note.unindent(outer_context);
          grandchild_note.previousNote().id().should.eql '2a'
          grandchild_note.nextNote().id().should.eql '2b'
        end
      end
      
      describe 'first sibling has a parent'
        // it 'should update notes'
        //   fourth_grandchild_note.unindent(outer_context);
        //   outer_context.update_object_attributes.should.not.be_null
        // end
        
        it 'should change the dom'
          third_grandchild_note.unindent(outer_context);
          third_grandchild_note.previousNote().id().should.eql '2b'
          third_grandchild_note.firstChildNote().id().should.eql '2bIII'
        end
      end
    end
    
    describe 'unindentUpdateNotePointers'
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

    describe 'unindentNoteInDom'
      describe 'i have a parent note'
        describe 'i have no next notes'
          before_each
            grandchild_note.unindentNoteInDom();
          end
        
          it 'should set my parent note to my former parents parent note'
            grandchild_note.parentNote().id().should.eql '2'
          end
        
          it 'should set my previous note to my former parent note'
            grandchild_note.previousNote().id().should.eql '2a'
          end
        
          it 'should set my next note to my former parents next note'
            grandchild_note.nextNote().id().should.eql '2b'
          end
        end
      
        describe 'i have next notes'
          before_each
            second_grandchild_note.unindentNoteInDom();
          end
        
          it 'should set my parent note to my former parents parent note'
            second_grandchild_note.parentNote().id().should.eql '2'
          end
        
          it 'should set my previous note to my former parent note'
            second_grandchild_note.previousNote().id().should.eql '2b'
          end
        
          it 'should set my next note to my former parents next note'
            second_grandchild_note.nextNote().should.be_undefined
          end
        
          it 'should set my first child note to my former next note'
            second_grandchild_note.firstChildNote().id().should.eql '2bII'
          end
          
          it 'should set all the child notes of my former parent as my child notes'
            third_grandchild_note.nextNote().id().should.eql '2bIII'
          end
        end
        
        describe 'i have child notes'
          before_each
            child_note.unindentNoteInDom();
          end
          
          it 'should set my parent note to my former parents parent note'
            child_note.parentNote().should.be_undefined
          end
        
          it 'should set my previous note to my former parent note'
            child_note.previousNote().id().should.eql '2'
          end
        
          it 'second_child_note set my next note to my former parents next note'
            child_note.nextNote().id().should.eql '3'
          end
          
          it 'should keep my child notes'
            child_note.firstChildNote().id().should.eql '2aI'
          end
          
          it 'should append all the child notes of my former parent to my child notes'
            child_note.firstChildNote().nextNote().id().should.eql '2b'
          end
          
          it 'should not duplicate any notes'
            child_note_element.children('ul.indent').length.should.eql 1
          end
        end
      end
      
      describe 'my first sibling has a parent'
        describe 'i have no next notes'      
          before_each
            fourth_grandchild_note.unindentNoteInDom();
          end
        
          it 'should set my parent note to my former parents parent note'
            fourth_grandchild_note.parentNote().id().should.eql '2'
          end
        
          it 'should set my previous note to my former parent note'
            fourth_grandchild_note.previousNote().id().should.eql '2b'
          end
        
          it 'should set my next note to my former parents next note'
            fourth_grandchild_note.nextNote().should.be_undefined
          end
        end
      
        describe 'i have next notes'
          before_each
            third_grandchild_note.unindentNoteInDom();
          end
          
          it 'should set my parent note to my former parents parent note'
            third_grandchild_note.parentNote().id().should.eql '2'
          end
        
          it 'should set my previous note to my former parent note'
            third_grandchild_note.previousNote().id().should.eql '2b'
          end
        
          it 'should set my next note to my former parents next note'
            third_grandchild_note.nextNote().should.be_undefined
          end
          
          it 'should set the child notes of my former parent that come ofter me as my child notes'
            third_grandchild_note.firstChildNote().id().should.eql '2bIII'
          end
          
          it 'should leave the child notes of my former parent that come before me with my former parent'
            second_child_note.firstChildNote().id().should.eql '2bI'
          end
        end
      end
    end
  end 
end
