describe 'lib'
  describe 'slugize'
    it 'should a lowercase version of the string'
      slugize("Banana").should.eql 'banana'
    end
    
    it 'should replace blanks with dashs'
      slugize("a test string").should.eql 'a-test-string'
    end
  end
  
  describe 'strip'
    it 'should remove leading blanks'
      strip(" hello a test string").should.equal 'hello a test string'
    end
    
    it 'should remove trailing blanks'
      strip("hello a test string ").should.equal 'hello a test string'
    end
  end
end