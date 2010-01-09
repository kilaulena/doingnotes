describe 'outline_helpers'
  describe 'getOutlineId()'
    it 'should return the outline ID'
      var context = {
        $element: function(){return $(fixture('outline'))}
      }
      OutlineHelpers.getOutlineId.call(context).should.eql 'storyboard'
    end
    
    it 'should return undefined when there is no outline ID in the dom'
      var context = {
        $element: function(){return $(fixture('startpage'))}
      }
      OutlineHelpers.getOutlineId.call(context).should.be_undefined
    end
  end
end