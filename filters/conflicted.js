function(doc, req) {
  if(doc._conflicts && doc.type == "Note") {
    return true;
  }
  return false;
}