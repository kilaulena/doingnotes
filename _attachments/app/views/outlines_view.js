OutlinesView = function(context, couchapp) {
  ov = this;
  ov.context  = context;
  ov.couchapp = couchapp;
}

OutlinesView.prototype = {
  listOutlines: function(){
    ov.context.list_objects('Outline', 'outlines', [], function(json){ 
      var view = {};
      if (json.outlines.length > 0){
        var outlines = json.outlines.sort(byDate);
        view.outlines = outlines.map(function(outline){return new OutlineView(outline)});
        view.outlines = view.outlines.map(function(outline){
          return {
            title: outline.title(), 
            short_created_at: outline.short_created_at(),
            _id: outline._id()
          }
        }); 
      } else {
        view.empty = "You have no outlines yet."
      }
      ov.context.render('index', view);
      $('#spinner').hide(); 
    });
  },
  
  showOutline: function(params){
    var context = ov.context;
    var view = {};
    ov.couchapp.design.view('notes_by_outline', {
      startkey: [params.id],
      endkey: [params.id, {}],
      success: function(json) {
        if(json.rows[0]) {
          view.title      = json.rows[0].value.title;
          view.outline_id = json.rows[0].value._id;
          json.rows.splice(0,1);        
          if (json.rows.length > 0) { 
            var notes = json.rows.map(function(row) {return new Note(row.value)}); 
            view.notes = [(new NoteCollection(notes)).firstNote()];
            context.renderOutline(context, view, (new NoteCollection(notes)), ov.couchapp, params.solve);
          } else {
            context.create_object('Note', {outline_id: view.outline_id, first_note: true, text:'', source: ov.context.getLocationHash()}, {}, function(note){
              view.notes = [note];
              context.renderOutline(context, view, (new NoteCollection([])), ov.couchapp, params.solve);
            })            
          } 
        } else {
          ov.flash = {message: 'Outline does not exist.', type: 'error'};
          context.redirect('#/outlines', ov.flash);
        }      
      }
    });
  },
  
  deleteOutlineWithNotes: function(params){
    ov.couchapp.design.view('notes_by_outline', {
      startkey: [params.id],
      endkey: [params.id, {}],
      success: function(json) {
        if (json.rows.length > 0) { 
          var outline_and_notes = json.rows.map(function(row) {return row.value}); 
          ov.couchapp.db.bulkRemove({docs: outline_and_notes}, {
            success: function() {
              ov.flash = {message: 'Outline deleted.', type: 'notice'}
              $('#spinner').hide(); 
              ov.context.redirect('#/outlines', ov.flash);
            },
            error: function(response_code, json) {
              ov.flash = {message: 'Error deleting outline: ' + json, type: 'error'};
            }
          });
        }      
      }
    });
  }
}