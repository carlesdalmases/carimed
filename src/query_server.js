function query_server(url_query) 
{
	var deferred = $.Deferred();
	
	$.ajaxSetup({type: 'GET',
				 dataType: 'jsonp'});
    
    var qs = $.ajax({url: url_query,});

    $.when(qs).done(function(data){deferred.resolve(data)});
    return deferred.promise();
}
