function(doc) {
  if(doc.type == 'Note') {
    emit(doc['text'], null);
  }
}