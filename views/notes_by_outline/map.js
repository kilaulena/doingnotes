function(doc) {
  if (doc.type == "Note") {
    emit([doc.outline_id, doc.created_at], doc);
  }
}