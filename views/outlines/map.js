function(doc) {
  if(doc.kind == 'Outline') {
    emit(doc._id, doc);
  }
}