function(doc) {
  if(doc._conflicts && doc.kind == "Note") {
    emit(doc.outline_id, doc);    
  }
}