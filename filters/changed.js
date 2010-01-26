function(doc, req) {
  if(doc.type == 'Note' && doc.source != req.query.source) {
    return true;
  }
  return false;
}