function(doc, req) {
  if(doc.kind == 'Note' && doc.source != req.query.source) {
    return true;
  }
  return false;
}