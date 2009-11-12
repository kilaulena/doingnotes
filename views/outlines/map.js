function(doc) {
  if(doc.type == 'Outline') {
    emit(doc._id, doc);
  }
}