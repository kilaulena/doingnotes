describe 'lib'
  describe 'slugize'
    it 'should a lowercase version of the string'
      slugize("Banana").should.eql 'banana'
    end
    
    it 'should replace blanks with dashs'
      slugize("a test string").should.eql 'a-test-string'
    end
  end
  
  describe 'stripBlanks'
    it 'should remove leading blanks'
      stripBlanks(" hello a test string").should.equal 'hello a test string'
    end
    
    it 'should remove trailing blanks'
      stripBlanks("hello a test string ").should.equal 'hello a test string'
    end
    
    it 'should not remove non-word characters'
      stripBlanks("hello a test string!").should.equal 'hello a test string!' 
    end
  end
end