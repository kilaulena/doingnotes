function(doc) {
  if (doc.kind == "Outline") {
    emit([doc._id, 0], doc);
  } else if (doc.kind == "Note") {
    emit([doc.outline_id, 1, Date.parse(doc.created_at)], doc);
  }
}