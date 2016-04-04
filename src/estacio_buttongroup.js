function estacio_buttongroup()
{

	//Obtenir la llista d'estacions
	var URL_estacio_list = 'https://ub.cartodb.com:443/api/v2/sql?q=select * from public.estacions order by nomriu asc';
	query_server(URL_estacio_list).then
	(
		function(df)
		{
			
			carimedconfig.list_estacions = df.rows;
			
			//Construir el botó dropdown
			var $newDivButtonGroup = $("<div/>")
							   		.addClass("btn-group");


			_.each(carimedconfig.list_estacions, function(d){
							
							var $newButton = $("<button/>")
									.addClass("btn btn-default btn-xs")
									.attr("type", "button")
									.attr("style", "margin:1px")
									.attr("value", d.estacio)
									.on("click", function(){grafic_estacio(this.value);})
									.html(d.estacio);
							
							$newDivButtonGroup.append($newButton);
			});
		
			$('#select_estacio').append($newDivButtonGroup);
			
			//Dibuixo una estació qualsevol
			grafic_estacio('B22');
		}
	);

} // Fi de estacio_button_group()
