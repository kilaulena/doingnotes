function(doc, req) {
  if(doc._conflicts && doc.kind == "Note") {
    return true;
  }
  return false;
}