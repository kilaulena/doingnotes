function(doc) {
  if (doc.type == "Outline") {
    emit([doc._id, 0], doc);
  } else if (doc.type == "Note") {
    emit([doc.outline_id, 1, Date.parse(doc.created_at)], doc);
  }
}