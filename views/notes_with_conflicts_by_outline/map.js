function(doc) {
  if(doc._conflicts && doc.type == "Note") {
    emit(doc.outline_id, doc);    
  }
}