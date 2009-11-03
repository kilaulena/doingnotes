function(doc) {
  if(doc.type == 'Note') {
    emit(doc._id, doc);
  }
}