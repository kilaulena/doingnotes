var OutlineConflictHelpers = {
  findNoteElementById: function(id){
    return new NoteElement(this.$element().find('li#edit_note_' + id).find('textarea.expanding:first'))
  },
  
  checkForNewUpdatesAndConflicts: function(couchapp, solve){
    if(this.ENV == 'production'){
      this.checkForUpdates(couchapp);
      
      ConflictDetector(this, couchapp);
      ConflictPresenter(this, couchapp);
      ConflictResolver(this, couchapp);
      var conflictDetector = new ConflictDetector(this, couchapp)
      if(solve){
        conflictDetector.presenter.showConflicts();
      } else {
        conflictDetector.checkForNewConflicts();
      }
    }
  }
}