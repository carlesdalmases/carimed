function grafic_estacio(codi_estacio)
{

	//Buidar <div id="graph">
	$("#graph").empty();
	
	//Margins
	var margin = {top: 20, right: 20, bottom: 50, left: 50},
	width = carimedconfig.abs_width - margin.left - margin.right,
	height = carimedconfig.abs_height - margin.top - margin.bottom;

	//Formatejadors
	var commasFormatter = d3.format(".0f")

	//Escala de colors
	var c10 = d3.scale.category10();

	//Escala X
	var scaleX = d3.time.scale()
	          .range([0, width]);

	//Escala Y
	var scaleY = d3.scale.linear()
	          .range([height, 0]);
	
	//Eix X
	var xAxis = d3.svg.axis()
	            .scale(scaleX)
	            .orient("bottom")
				.tickPadding(8);
	//Eix Y
	var yAxis = d3.svg.axis()
	            .scale(scaleY)
	            .orient("left");

	//Linia
	var line = d3.svg.line()
		.interpolate("monotone") 
	    .x(function(d) { return scaleX(d.datatemps);})
	    .y(function(d) { return scaleY(d.ibmwp);});


	//Grafic
	var svg = d3.select("div#graph").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	//Consulta a la base de dades
	var URL_query = 'https://ub.cartodb.com:443/api/v2/sql?q=select data as datatemps,data_any as dataany, ibmwp,ibmwp_rang from public.indexbio where estacio like \'' + codi_estacio +'\' AND epoca=0 order by data_any asc';
	
	query_server(URL_query).then
	(
			function(df)
			{
				
				//Convertir les dates en objecte Date
				_.each(df.rows, function(d)
				{
					var s = new Date();
					s.setTime(Date.parse(d.datatemps));
					d.datatemps = s;
				});
				
				
				//Calculo el domini (mínim i màxim) per l'escala associada a cada eix.
				scaleX.domain(d3.extent(df.rows, function(d) { return d.datatemps; }));
				scaleY.domain(d3.extent(df.rows, function(d) { return d.ibmwp; }));
				
				
				
				//Defineixo les etiquetes dels ticks que han d'apareixer.
				//Primer obtinc un array dels anys amb dades, sense repeticions.
				var year_uniq = _.uniq(_.map(df.rows, function(d){return d.datatemps.getFullYear();}),true);
				//Array de Date objectes, s'estableixen a 1/1/YYYY
				var year_ticks = [];
				_.each(year_uniq, function(d){year_ticks.push(new Date(d,0,1))});
				xAxis.tickValues(year_ticks);
				
				//Afegir eix X
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.selectAll("text")
					.attr("y",10)
					.attr("x", 9)
					.attr("dy", ".35em")
					.attr("transform", "rotate(50)")
					.style("text-anchor", "start");
			
				//Afegir eix Y				
				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("IBMWP");
				
				//Afegir linia
				svg.append("path")
					.datum(df.rows)
					.attr("class", "line")
					.attr("d", line)
					.attr("stroke", "green")
					.attr("stroke-width", 2)
					.attr("fill", "none");

				//Punts
				svg.selectAll(".dot")
					.data(df.rows)
					.enter().append("circle")
					.attr("class", "dot")
					.attr("r", 3.5)
					.attr("cx", function(d) { return scaleX(d.datatemps); })
					.attr("cy", function(d) { return scaleY(d.ibmwp); })
					.style("fill", function(d) { return colores_google(d.ibmwp_rang); })
					.append("svg:title")
					.text(function(d, i) { return "IBMWP: " + d.ibmwp + "\nRang: " + d.ibmwp_rang + "\nData: "+d.datatemps.toLocaleDateString();});

				graph_title();

			}
	);
	
function graph_title()
{
				// Add graph title
				var estacio_seleccionada = _.findWhere(carimedconfig.list_estacions, {estacio: codi_estacio});
				svg.append("text")
					.attr("transform", "translate(50,10)")
					.attr("text-anchor", "top")  
					.style("font-size", "20px") 
					.style("text-decoration", "none")  
					.text(estacio_seleccionada.estacio);
					
				svg.append("text")
					.attr("transform", "translate(50,25)")
					.attr("text-anchor", "top")  
					.style("font-size", "12px") 
					.style("text-decoration", "none")  
					.text(estacio_seleccionada.toponim);

				svg.append("text")
					.attr("transform", "translate(50,45)")
					.attr("text-anchor", "top")  
					.style("font-size", "10px") 
					.style("text-decoration", "none")  
					.text("Posició XY (ETRS89-UTM31N): "+estacio_seleccionada.x_utm+", "+estacio_seleccionada.y_utm);

				svg.append("text")
					.attr("transform", "translate(50,55)")
					.attr("text-anchor", "top")  
					.style("font-size", "10px") 
					.style("text-decoration", "none")  
					.text("Riu: "+estacio_seleccionada.nomriu);
				
				svg.append("text")
					.attr("transform", "translate(50,65)")
					.attr("text-anchor", "top")  
					.style("font-size", "10px") 
					.style("text-decoration", "none")  
					.text(estacio_seleccionada.tm);
};

} // Fi de grafic_estacio_()

function colores_google(n) {
  var colores_g = ["#3E7BB6", "#33a02c", "#ffcc00", "#ff9900", "#b81609", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040", "#404040"];
  return colores_g[(n-1) % colores_g.length];
}

