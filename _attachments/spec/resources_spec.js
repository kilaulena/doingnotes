describe 'Resources helper'
  describe 'template_file_for'
    it 'should extract the path for a template from the url hash'
      template_file_for("#/notes/write", "write").should.eql "app/templates/notes/write.mustache"
      template_file_for("#/notes/byText", "index").should.eql "app/templates/notes/index.mustache"
    end
  end
  
  describe 'pluralize'
    it 'should return a string in underscore'
      pluralize('Notes').should.eql 'notes'
    end
    
    it 'should append an s'
      pluralize('Note').should.eql 'notes'
    end
    
    it 'should not append an s when string ends with s'
      pluralize('Notes').should.eql 'notes'
    end
  end
end
    