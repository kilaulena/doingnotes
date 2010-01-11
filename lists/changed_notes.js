function(head, req) {
	var filter = req.query.filter;
	var row; 
	var rows = [];
	while(row = getRow()) {
    if (filter.indexOf(row.value.source) == -1 && row.value.type == "Note"){
			rows.push(row.id + ' with source ' + row.value.source + ';');
    }
	}
	send(rows.length);
}

