describe 'outline_helpers'
  describe 'getOutlineId()'
    it 'should return the outline ID'
      var context = {
        $element: function(){return $(fixture('outline'))}
      }
      OutlineHelpers.getOutlineId.call(context).should.eql 'storyboard'
    end
  end
end