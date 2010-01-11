function(head, req) {
	var filter = req.query.filter;
	var row;
	while(row = getRow()) {
    if (filter.indexOf(row.value.source) == -1 && row.value.type == "Note"){
			send(row.id + ' with source ' + row.value.source + ' ;');
    }
	}
}

