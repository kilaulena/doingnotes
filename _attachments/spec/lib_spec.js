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
  
  describe 'Array extensions'
    describe 'contains'
      before_each
        array = [1, 2, 3, 4, 5];
      end
      
      it 'should return true if the array contains an element'
        array.contains(1).should.be_true
      end
      
      it 'should return false if the array doesnt contain an element'
        array.contains(7).should.be_false
      end
    end
    
    describe 'subtract'
      before_each
        long_array  = [1, 2, 3, 4, 5];
        short_array = [2, 3];
      end

      it 'should an array with the elements that are in the first but not in the second'
        long_array.subtract(short_array).should.eql [1, 4, 5]
      end
      
      it 'should return an empty array when the first contains at the least the elements from the second'
        short_array.subtract(long_array).should.eql []
      end
      
      it 'should return an empty array when the second array is empty'
        [].subtract([]).should.eql []
        [].subtract(long_array).should.eql []
      end
      
      it 'should return all the elements of the first array when the second array is empty'
        long_array.subtract([]).should.eql [1, 2, 3, 4, 5]
      end
    end
    
    describe 'remove'
      before_each
        array = [1, 2, 3, 4, 5];
      end
      
      it 'should return the array without the given element'
        array.remove(3).should.eql [1, 2, 4, 5]
      end
      
      it 'should return the unchanged array when the given element is not in the array'
        array.remove(9).should.eql array
      end
    end
    
    describe 'compact'
      it 'should remove all the null values from an array'
        [1, null, null, 3, 4].compact().should.eql [1, 3, 4]
      end
    end
    
    describe 'flatten'
      it 'should return an array with the elements of the arrays subarrays'
        [1, 2, [7, 8], [11]].flatten().should.eql [1, 2, 7, 8, 11]
      end
      
      it 'should work recursively'
        [1, 2, [7, 8], [11, [30, 40]]].flatten().should.eql [1, 2, 7, 8, 11, 30, 40]
      end
    end
    
    describe 'reject'
      it 'should return an array with the elements that dont match the given function'
        var result = [1, 2, 3, 4, 5].reject(function(e){
          return e > 2;
        });
        result.should.eql [1, 2]
      end
    end
    
    describe 'select'
      it 'should return an array with the elements that match the given function'
        var result = [1, 2, 3, 4, 5].select(function(e){
          return e > 2;
        });
        result.should.eql [3, 4, 5]
      end
    end
  end
end